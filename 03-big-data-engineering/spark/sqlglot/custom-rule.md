




Perfect — this is the right way to structure it.

## Recommended pipeline (deterministic)

1. **`targets_cte`**: fixed.
2. **`filter_mass_cte`**:
   - always `FROM mass JOIN targets ON mass.MOBILENUMBER = targets.mobile_number`
   - always apply `DATE` filter
   - select mandatory columns + columns required by user SQL.
3. **Normalize `user_sql`**:
   - parse with `sqlglot.parse_one(..., read="spark")`
   - preserve original user CTE order exactly
   - rewrite table refs `mass -> filter_mass`
4. **Final projection** (fixed schema):
   - output `MOBILENUMBER, DATE, target_name`
   - always `GROUP BY DATE, MOBILENUMBER` (and `target_name` for SQL correctness)

---

## Production-style sqlglot implementation

```python
import sqlglot
from sqlglot import exp

MANDATORY_COLS = {"MOBILENUMBER", "DATE", "target_name", "PROTOCOL"}

def build_targets_cte_expr(targets_json: str) -> exp.Expression:
    # Spark-specific lateral view is easiest to parse from SQL text
    sql = f"""
    SELECT
      target_entry.key AS mobile_number,
      target_entry.value.target_name AS target_name
    FROM
      (
        SELECT
          from_json(
            '{targets_json}',
            'array<map<string,struct<target_name:string>>>'
          ) AS arr
      ) r
    LATERAL VIEW EXPLODE(arr) a AS target_map
    LATERAL VIEW EXPLODE(MAP_ENTRIES(target_map)) t AS target_entry
    """
    return sqlglot.parse_one(sql, read="spark")


def extract_column_names(expr: exp.Expression) -> set[str]:
    """
    Collect referenced column names from user SQL.
    We keep only bare names (ignore qualifier), then uppercase for Spark-style columns.
    """
    cols = set()
    for c in expr.find_all(exp.Column):
        if c.name:
            cols.add(c.name.upper())
    return cols


def replace_table_name(expr: exp.Expression, old_name: str, new_name: str) -> exp.Expression:
    """
    Replace table references globally, preserving aliases.
    """
    def _transform(node):
        if isinstance(node, exp.Table) and node.name and node.name.lower() == old_name.lower():
            return exp.to_table(new_name).as_(node.alias_or_name) if node.alias else exp.to_table(new_name)
        return node

    return expr.transform(_transform)


def build_filter_mass_cte(required_cols: set[str], date_value: str) -> exp.Expression:
    """
    Build filter_mass with fixed join/date logic and dynamic projection.
    """
    # Always keep these from mass + targets
    required_cols = {c.upper() for c in required_cols} | MANDATORY_COLS

    select_exprs = []

    # from mass
    for c in sorted(required_cols):
        if c == "target_name".upper():
            continue
        # route all non-target_name columns from mass
        select_exprs.append(exp.column(c, table="mass"))

    # from targets
    select_exprs.append(exp.column("target_name", table="targets"))

    q = (
        exp.select(*select_exprs)
        .from_("mass")
        .join("targets", on="mass.MOBILENUMBER = targets.mobile_number")
        .where(f"mass.DATE IN (DATE('{date_value}'))")
    )
    return q


def normalize_user_sql(user_sql: str) -> tuple[list[exp.CTE], exp.Expression]:
    """
    Returns:
      - user_ctes in original order
      - user_body (final SELECT/QUERY body)
    For plain SQL (no WITH), returns empty CTE list and parsed body.
    """
    root = sqlglot.parse_one(user_sql, read="spark")
    with_clause = root.args.get("with")

    if with_clause and with_clause.expressions:
        user_ctes = list(with_clause.expressions)   # preserve sequence
        # remove WITH from body copy
        user_body = root.copy()
        user_body.set("with", None)
        return user_ctes, user_body

    return [], root


def build_final_query(user_sql: str, targets_json: str, date_value: str) -> str:
    # 1) Parse and normalize user SQL
    user_ctes, user_body = normalize_user_sql(user_sql)

    # 2) Gather required columns from user logic (+ final fixed schema)
    required = extract_column_names(user_body)
    for cte in user_ctes:
        required |= extract_column_names(cte)

    # 3) Build fixed CTEs
    targets_expr = build_targets_cte_expr(targets_json)
    filter_mass_expr = build_filter_mass_cte(required_cols=required, date_value=date_value)

    # 4) Rewrite user SQL to consume filter_mass instead of mass
    user_body = replace_table_name(user_body, "mass", "filter_mass")
    rewritten_user_ctes = [replace_table_name(c.copy(), "mass", "filter_mass") for c in user_ctes]

    # 5) If user had no CTEs, wrap body as user_cte for predictable final stage
    if not rewritten_user_ctes:
        rewritten_user_ctes = [exp.CTE(this=user_body, alias=exp.TableAlias(this=exp.to_identifier("user_cte")))]
        user_source = "user_cte"
    else:
        # last user CTE name is the effective user output anchor
        last = rewritten_user_ctes[-1]
        user_source = last.alias_or_name

        # if user body is not a simple SELECT from last CTE, wrap it too
        rewritten_user_ctes.append(
            exp.CTE(this=user_body, alias=exp.TableAlias(this=exp.to_identifier("user_final_cte")))
        )
        user_source = "user_final_cte"

    # 6) Fixed final projection
    final_select = sqlglot.parse_one(
        f"""
        SELECT
          MOBILENUMBER,
          DATE,
          MAX(target_name) AS target_name
        FROM {user_source}
        GROUP BY DATE, MOBILENUMBER, target_name
        """,
        read="spark",
    )

    # 7) Attach WITH in exact sequence:
    # system fixed first, then user CTEs (preserved order)
    final_query = (
        final_select
        .with_("targets", as_=targets_expr)
        .with_("filter_mass", as_=filter_mass_expr, append=True)
    )

    for cte in rewritten_user_ctes:
        # append each CTE in sequence
        final_query = final_query.with_(
            cte.alias_or_name,
            as_=cte.this,
            append=True,
        )

    return final_query.sql(dialect="spark", pretty=True)
```

---

## Why this works for your “plain SQL / single CTE / multiple CTEs” requirement

1. **CTE sequence guaranteed**: user CTE list is read and re-appended in original order.
2. **Fixed guardrail logic**: join + date filter always happens once in `filter_mass`.
3. **User flexibility**: user SQL can stay complex; only source table gets rewritten to `filter_mass`.
4. **Stable output contract**: final output always has fixed schema and grouping.

---

## Practical notes

1. If user SQL uses aliases like `m.MOBILENUMBER` from `mass m`, replacement still works, but validate alias-heavy edge cases.
2. If user query references columns not in `mass`/`targets`, add validation and fail fast before SQL generation.
3. If you truly need exactly `GROUP BY DATE, MOBILENUMBER` only, then use:
   - `MAX(target_name) AS target_name`
   - group by those 2 columns only.
   (Current snippet groups by `target_name` too for strict correctness across engines.)

If you want, I can next give a **small test matrix** (3 user_sql inputs: plain / 1 CTE / 3 CTEs) and expected generated SQL shape.