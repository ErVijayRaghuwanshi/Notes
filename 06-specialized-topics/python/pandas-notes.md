# 🐼 Python Pandas 2.x - Specialized Topics Notes

A comprehensive guide to modern Pandas (2.x), focusing on performance optimizations, the PyArrow backend, and Copy-on-Write (CoW) mechanics.

---

## 1. Introduction / Overview

- **What is this topic?** Pandas is the standard data manipulation and analysis library for Python. The 2.x releases introduced paradigm-shifting performance updates.
- **Why does it matter?** Traditional Pandas struggled with memory bloat and performance on large datasets. Pandas 2.0+ solves this by decoupling from NumPy and adopting Apache Arrow via the PyArrow backend, along with Copy-on-Write (CoW).
- **Key use cases:** Data cleaning, ETL pipelines, exploratory data analysis (EDA), and feature engineering.

---

## 2. Core Concepts

- **DataFrame & Series**: The foundational 2D and 1D data structures.
- **Copy-on-Write (CoW)**: Introduced in Pandas 2.0 (and default in 3.0). It eliminates defensive copying. Data is only copied when it is mutated, significantly reducing memory usage.
- **PyArrow Backend**: PyArrow provides a unified, efficient, C++ based memory format for analytical data. It supports better missing value handling (`pd.NA` vs `np.nan`) and much faster string operations.
- **Vectorization**: Performing operations on entire arrays rather than iterating through rows, leveraging underlying C/C++ implementations.

---

## 3. Modern Pandas Features (2.x+)

### ⚡ PyArrow Integration
By default, Pandas relies on NumPy types (e.g., `float64`, `object` for strings). Using PyArrow types provides massive speedups.

```python
import pandas as pd

# Standard (NumPy backed)
df_np = pd.read_csv("data.csv") 

# PyArrow backed (Pandas 2.0+)
df_pa = pd.read_csv("data.csv", dtype_backend="pyarrow", engine="pyarrow")
```

### 💡 Copy-on-Write (CoW)
To enable CoW in Pandas 2.x (it will be default in 3.x):

```python
import pandas as pd
pd.options.mode.copy_on_write = True

df = pd.DataFrame({"A": [1, 2, 3]})
# This no longer creates a copy in memory immediately!
df_view = df["A"] 

# A copy is only triggered when df_view or df is modified.
df_view.iloc[0] = 100 
```

---

## 4. Trade-offs and Comparisons

| Framework | Memory Efficiency | Execution Speed | Distributed / Cluster | When to Use |
|-----------|-------------------|-----------------|-----------------------|-------------|
| **Pandas (NumPy)** | Low | Moderate | No | Legacy projects, small datasets (< 2GB). |
| **Pandas (PyArrow)** | High | Fast | No | Modern single-node data engineering (up to RAM limits). |
| **Polars** | Very High | Very Fast (Multithreaded) | No | High-performance single-node processing, complex aggregations. |
| **PySpark** | Moderate (JVM Overhead) | Very Fast | Yes | Big Data, distributed processing across clusters. |

---

## 5. Practical Examples

### ❌ Bad Example (Iterating Rows)

```python
# Anti-pattern: Iterating through rows is extremely slow
df = pd.DataFrame({"A": range(1000000)})
result = []
for index, row in df.iterrows():
    result.append(row["A"] * 2)
df["B"] = result
```

**Problems:**
- Bypasses vectorization.
- Extremely high overhead for Series creation on every row.

---

### ✅ Good Example (Vectorization)

```python
# Follows Principle: Use vectorized operations
df = pd.DataFrame({"A": range(1000000)})
df["B"] = df["A"] * 2
```

**Benefits:**
- Executes in C/C++ level (orders of magnitude faster).
- Clean, readable code.

---

## 6. Cheat Sheet

| Operation | Pandas Syntax |
|-----------|---------------|
| **Read CSV (PyArrow)** | `pd.read_csv('file.csv', engine='pyarrow', dtype_backend='pyarrow')` |
| **Filter Rows** | `df[df['column'] > 50]` or `df.query("column > 50")` |
| **Group & Aggregate** | `df.groupby('category').agg({'sales': 'sum', 'users': 'nunique'})` |
| **Handle Missing** | `df.fillna(0)` or `df.dropna(subset=['col_name'])` |
| **Merge (Join)** | `pd.merge(df1, df2, on='id', how='left')` |
| **Window Functions** | `df.groupby('id')['value'].rolling(window=3).mean()` |

---

## 7. Interview Q&A

### Basic (Q1-Q3)

**Q1: What is the difference between `loc` and `iloc`?**
> - `loc` is label-based indexing. You select data based on the names of the rows and columns.
> - `iloc` is integer-position-based indexing. You select data based on their 0-based integer position.

**Q2: How do you handle missing values in Pandas?**
> - You can drop them using `dropna()`.
> - You can fill them using `fillna(value)` or forward/backward fill (`ffill()`, `bfill()`).
> - In Pandas 2.0 with PyArrow, `pd.NA` represents true missing values across all data types (unlike `np.nan` which forces floats).

### Intermediate (Q4-Q6)

**Q3: What is Copy-on-Write (CoW) in Pandas?**
> CoW is a memory optimization technique. When a DataFrame is sliced or assigned to a new variable, Pandas creates a "view" instead of copying the underlying data array. A physical copy of the data is only made if one of the objects is mutated. This drastically reduces memory spikes and improves speed.

**Q4: Why are PyArrow strings faster than NumPy strings in Pandas?**
> NumPy strings are stored as arrays of Python `object` pointers. This means memory is fragmented, and operations require Python API calls. PyArrow strings use a contiguous memory layout (Apache Arrow specification) allowing true vectorized string operations without the Python Global Interpreter Lock (GIL) overhead.

### Advanced (Q7+)

**Q5: How would you optimize a Pandas pipeline that is running out of memory (OOM)?**
> 1. Enable **Copy-on-Write** (`pd.options.mode.copy_on_write = True`).
> 2. Switch to the **PyArrow backend** (`dtype_backend="pyarrow"`).
> 3. Downcast numeric types (e.g., `float64` to `float32`).
> 4. Load data in chunks using the `chunksize` parameter in `read_csv()`.
> 5. Convert low-cardinality string columns to `category` dtypes.

---

## 🔗 Related Topics

- [PySpark Core](../../03-big-data-engineering/03-spark-core/spark-core-notes.md)

---

*Last updated: May 2026*
