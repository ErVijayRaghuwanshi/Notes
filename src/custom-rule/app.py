import streamlit as st
import sqlglot
from sqlglot import exp, parse_one, dialects
from string import Template
import json
import datetime

# Try to import streamlit-ace for the editor; fallback to text_area if missing
try:
    from streamlit_ace import st_ace
    HAS_ACE = True
except ImportError:
    HAS_ACE = False

# ==========================================
# 1. CORE LOGIC
# ==========================================

# mended filed in user select clause
MENDED_FIELDS = [
    "MOBILENUMBER",
    "DATE",
    "FirstSeenStartTime",
    "LastSeenStartTime",
    "BehaviourMetricKey",
    "BehaviourMetricValue"
]

def generate_anomaly_query(raw_query, criteria_type, is_training=False):
    """
    Generates the anomaly detection SQL using sqlglot.
    """
    try:
        if not raw_query:
            return "Error: Raw query is empty."
        
        base_parsed = parse_one(raw_query)
        # 1. mended fields check in raw query
        select_cols = {e.alias_or_name for e in base_parsed.find_all(exp.Alias)}
        missing_fields = [f for f in MENDED_FIELDS if f not in select_cols]
        if missing_fields:
            return f"Error: The following required fields are missing in the SELECT clause: {', '.join(missing_fields)}"

        # Fix Date quoting in RD to prevent the 2026-01-22 subtraction issue
        for in_expr in base_parsed.find_all(exp.In):
            for i, e in enumerate(in_expr.expressions):
                if isinstance(e, exp.Column) and e.name == '$DATE':
                    in_expr.expressions[i] = exp.Literal.string("$DATE")

        rd_expression = base_parsed.copy()

        # 2. Targets CTE Logic
        targets_sql = """
        SELECT target_entry.key AS mobile_number, target_entry.value.target_name AS target_name 
        FROM (SELECT from_json('$TARGETS', 'array<map<string,struct<target_name:string>>>') AS arr) raw 
        LATERAL VIEW EXPLODE(arr) a AS target_map 
        LATERAL VIEW EXPLODE(MAP_ENTRIES(target_map)) t AS target_entry
        """
        targets_expression = parse_one(targets_sql)

        # 3. Final Projection Mapping
        final_projection = [
            "CONCAT(MOBILENUMBER, '-AID-$RULE_ID-', DATE) AS id",
            "MOBILENUMBER AS MobileNumber",
            "target_name AS TargetName",
            "'$BEHAVIOURMETRICTYPE' AS BehaviourMetricType",
            "BehaviourMetricKey",
            "BehaviourMetricValue",
            "'$AnomalyIdentifiedLevel' AS AnomalyIdentifiedLevel",
            "FirstSeenStartTime",
            "LastSeenStartTime",
            "DATE AS Date",
            "'$RULE_ID' AS RuleId",
            "'$RULE_NAME' AS RuleName",
            "'$UNIQUE_NAME' AS GroupRuleName",
            "'$GROUP_ID' AS GroupId",
            "'$GROUP_NAME' AS GroupName",
            "'$GROUP_TYPE' AS GroupType",
            "'$TRAINING_PERIOD' AS TrainingPeriod",
            "'$RULE_DESC' AS AnomalyDescription",
            "'$EVIDENCE' AS Evidence",
            "'$THRESHOLDVALUELIST' AS ThresholdValueList"
        ]
        select_exprs = [parse_one(c) for c in final_projection]
        
        # 4. Build Final Query Base
        final_query = (
            exp.select(*select_exprs)
            .from_("RD")
            .join("targets", on="RD.MOBILENUMBER = targets.mobile_number")
        )
        
        # Add Base CTEs
        final_query = final_query.with_("targets", as_=targets_expression)
        final_query = final_query.with_("RD", as_=rd_expression)

        # 5. Conditional Training Logic
        if is_training:
            tr_expression = base_parsed.copy()
            
            # Build dynamic WHERE clause for historical lookback
            tr_where = exp.Between(
                this=exp.column("DATE"),
                low=exp.func("date_sub", exp.Literal.string("$DATE"), exp.Literal.number('$TRAINING_PERIOD')),
                high=exp.func("date_sub", exp.Literal.string("$DATE"), exp.Literal.number(1))
            )
            tr_expression.set("where", exp.Where(this=tr_where))
            
            # Add TR CTE to final query
            final_query = final_query.with_("TR", as_=tr_expression)

            # Apply Existence Check
            exists_subquery = exp.select("1").from_("TR").where("TR.MOBILENUMBER = RD.MOBILENUMBER")
            
            if criteria_type == '1': # Behavior Observed
                final_query = final_query.where(exp.Exists(this=exists_subquery))
            else: # Behavior NOT Observed (criteria_type == '2')
                final_query = final_query.where(exp.Not(this=exp.Exists(this=exists_subquery)))

        return final_query.sql(pretty=True)
    except Exception as e:
        return f"Error generating query: {str(e)}"

# ==========================================
# 2. UI CONFIGURATION
# ==========================================

st.set_page_config(layout="wide", page_title="Anomaly SQL Generator")

st.title("🕵️ Anomaly Detection SQL Builder")
st.markdown("Generate generic Template SQL and fully Parsed SQL based on dynamic rules.")

# --- Sidebar: Configuration Variables ---
with st.sidebar:
    st.title("Configuration")
    
    with st.expander("1. System Variables", expanded=True):
        today = datetime.date(2026, 1, 22)
        selected_date = st.date_input("Execution Date", value=today)
        date_str = selected_date.strftime("%Y-%m-%d")
        
        training_period = st.number_input("Training Period (Days)", min_value=1, value=15)
    
    with st.expander("2. Rule Details", expanded=False):
        rule_id = st.text_input("Rule ID", "1001")
        rule_name = st.text_input("Rule Name", "High Frequency SMS")
        rule_desc = st.text_input("Description", "Detects unusual SMS volume")
        
        st.subheader("Group Details")
        group_id = st.text_input("Group ID", "1000")
        group_name = st.text_input("Group Name", "Default Group 1000")
        unique_name = st.text_input("Unique Name", "Draft_Unique_Name")

    with st.expander("3. Data Sources", expanded=False):
        mass_path = st.text_input("MASS Table Path", "parquet.`hdfs://SUNIPR/user/ctadmin/vijay/TargetAnomalies/MASS`")
        voip_path = st.text_input("VOIP Table Path", "parquet.`hdfs://SUNIPR/user/ctadmin/vijay/TargetAnomalies/VOIP`")

    # Hidden/Advanced Target JSON
    with st.expander("Advanced: Targets JSON", expanded=False):
        default_targets = r'''[{"9811002233": {"target_name": "VIP Exec Global"}}, {"9123456789": {"target_name": "Gateway Node East"}}, {"8800112244": {"target_name": "Staff Admin Alpha"}}, {"7042556677": {"target_name": "Sensor Fleet 01"}}, {"9988776655": {"target_name": "Retail POS Terminal"}}, {"6300445566": {"target_name": "Subject HighRisk 102"}}, {"8122334455": {"target_name": "Field Agent North"}}, {"9876543210": {"target_name": "Sentinel Test Probe"}}, {"7500119922": {"target_name": "Data Intensive User"}}, {"9011223344": {"target_name": "International Hub 05"}}]'''
        targets_json = st.text_area("Targets", value=default_targets, height=150)

    with st.expander("Logic Config", expanded=True):
        st.subheader("Logic Configuration")
        is_training = st.checkbox("Enable Training Period?", value=True)
        
        criteria_type = "0"
        if is_training:
            criteria_opt = st.radio(
                "Anomaly Criteria",
                options=["1", "2"],
                format_func=lambda x: "1: Observed" if x == '1' else "2: Not Observed"
            )
            criteria_type = criteria_opt
        
        metric_type = st.text_input("Metric Type", "SMS")
        anomaly_level = st.selectbox("Anomaly Level", ["Transaction", "Subscriber", "Account"])

# --- Main Area: Query Input & Logic ---

# col1, col2 = st.columns([3, 1])
col1 = st.columns([1])[0]

with col1:
    st.subheader("Raw SQL Query")
    default_query = "SELECT MOBILENUMBER, DATE, MIN(TRANSACTIONSTARTTIME) AS FirstSeenStartTime, MAX(TRANSACTIONSTARTTIME) AS LastSeenStartTime, 'SMS' as BehaviourMetricKey, count (distinct case when PROTOCOL = 'SMS' then TRANSACTIONSTARTTIME end) as BehaviourMetricValue, count (distinct case when PROTOCOL = 'VOICE' then TRANSACTIONSTARTTIME end) as VOICE_count from $MASS where DATE in ($DATE) group by MOBILENUMBER, DATE having BehaviourMetricValue >= 1 AND VOICE_count = 0"
    
    if HAS_ACE:
        # Use streamlit-ace for a proper code editor
        raw_query = st_ace(
            value=default_query,
            language="sql",
            theme="monokai", # Options: monokai, github, tomorrow, twilight, etc.
            key="sql_editor",
            height=300,
            wrap=True,
            auto_update=True # Update stream on every keystroke/blur
        )
    else:
        st.warning("`streamlit-ace` is not installed. Using standard text area. Please install it for syntax highlighting.")
        raw_query = st.text_area("Enter your base SQL here", value=default_query, height=300)

# --- Action ---
generate_btn = st.button("Generate SQL", type="primary")

if generate_btn:
    with st.spinner("Parsing and building query..."):
        
        # 1. Generate the Template SQL (Contains $VARs)
        template_output = generate_anomaly_query(raw_query, criteria_type, is_training)

        if "Error" in template_output:
            st.error(template_output)
        else:
            # 2. Build the Substitution Dictionary
            parsing_dict = {
                'TARGETS': targets_json.replace('"', '\\"'),
                'MASS': mass_path,
                'VOIP': voip_path,
                'DATE': date_str,
                'TRAINING_PERIOD': training_period,
                'RULE_ID': rule_id,
                'RULE_NAME': rule_name,
                'RULE_DESC': rule_desc,
                'UNIQUE_NAME': unique_name,
                'GROUP_ID': group_id,
                'GROUP_NAME': group_name,
                'GROUP_TYPE': "Rule",
                'BEHAVIOURMETRICTYPE': metric_type,
                'AnomalyIdentifiedLevel': anomaly_level,
                'EVIDENCE': 'Evidence',
                'THRESHOLDVALUELIST': '[]'
            }

            # 3. Substitute variables
            try:
                parsed_sql = Template(template_output).safe_substitute(parsing_dict)
                
                st.success("Query Generated Successfully!")
                
                # Output Tabs
                tab1, tab2, tab3, tab4 = st.tabs(["🔹 Template SQL", "🚀 Parsed / Executable SQL", "📊 Variable Map", "📜 One-Line Parsed"])
                
                # Helper for auto-height
                def calc_height(text, min_height=200):
                    line_count = text.count('\n') + 1
                    # Approx 20px per line
                    return max(min_height, line_count * 20)

                with tab1:
                    st.caption("This SQL contains variables (e.g., $DATE) suitable for parameterized execution.")
                    if HAS_ACE:
                        h = calc_height(template_output)
                        st_ace(value=template_output, language='sql', theme='monokai', readonly=True, height=h, key='out_tpl')
                    else:
                        st.code(template_output, language="sql")
                
                with tab2:
                    st.caption("This SQL has all variables substituted with the values from the sidebar.")
                    if HAS_ACE:
                        h = calc_height(parsed_sql)
                        st_ace(value=parsed_sql, language='sql', theme='monokai', readonly=True, height=h, key='out_prsd')
                    else:
                        st.code(parsed_sql, language="sql")

                with tab3:
                    st.json(parsing_dict)
                
                with tab4:
                    st.caption("Minified SQL in a single line (Wrapped).")
                    try:
                        # Attempt to parse and minify back to one line
                        one_line_sql = parse_one(parsed_sql).sql()
                    except:
                        # Fallback simple minify
                        # one_line_sql = parsed_sql.replace("\n", " ")
                        # instead use sqlglot to ensure proper formatting
                        one_line_sql = sqlglot.transpile(parsed_sql, read=dialects.Spark2, pretty=False)[0]
                        
                    if HAS_ACE:
                        # For wrapped text, we can't easily calculate height. Defaulting to 300 to show enough content.
                        h = calc_height(one_line_sql, min_height=500)
                        st_ace(value=one_line_sql, language='sql', theme='monokai', readonly=True, height=h, wrap=True, key='out_oneline')
                    else:
                        st.code(one_line_sql, language="sql")

            except Exception as e:
                st.error(f"Error during variable substitution: {e}")