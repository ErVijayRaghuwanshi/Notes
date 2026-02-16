
Below is a **hands-on learning path** where we intentionally start with a **bad (unoptimized) design**, then **fix it step by step**, build **relationships**, and finally **optimize for performance**.

We’ll use a **simple real-world domain: an online store**.

---

# Part 1: Start with a BAD (Unoptimized) Database Design ❌

### Scenario

We want to store:

* Customers
* Their orders
* Products in each order

### ❌ Bad Design (Everything in One Table)

```sql
CREATE TABLE orders_bad (
    order_id SERIAL PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    customer_address TEXT,
    product_names TEXT,      -- comma-separated
    product_prices TEXT,     -- comma-separated
    quantities TEXT,         -- comma-separated
    order_date TEXT,
    total_amount TEXT
);
```

### ❌ What’s Wrong Here?

* **Data duplication** (customer info repeated every order)
* **No relationships**
* **Comma-separated values** → impossible to query efficiently
* **Wrong data types** (`TEXT` for prices, dates)
* **No constraints** (invalid emails, negative quantities allowed)

### Example Bad Data

```sql
INSERT INTO orders_bad (
    customer_name, customer_email, customer_address,
    product_names, product_prices, quantities,
    order_date, total_amount
)
VALUES (
    'Alice',
    'alice@email.com',
    'NY, USA',
    'Laptop,Mouse',
    '1200,25',
    '1,2',
    '2025-01-10',
    '1250'
);
```

Try answering:

* How many times was **Mouse** sold?
* What’s the total revenue per product?

👉 Very painful.

---

# Part 2: Identify Entities (Core Database Design Skill)

We split the system into **entities**:

| Entity      | Description                |
| ----------- | -------------------------- |
| customers   | People who place orders    |
| orders      | One purchase               |
| products    | Items for sale             |
| order_items | Products inside each order |

This is **normalization**.

---

# Part 3: Create a Proper Normalized Design (3NF) ✅

## 1️⃣ Customers Table

```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    address TEXT
);
```

## 2️⃣ Products Table

```sql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0)
);
```

## 3️⃣ Orders Table

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
);
```

## 4️⃣ Order Items (Relationship Table)

```sql
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    CONSTRAINT fk_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id),
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id),
    CONSTRAINT unique_order_product
        UNIQUE (order_id, product_id)
);
```

---

# Part 4: Insert Data the RIGHT Way ✅

```sql
INSERT INTO customers (name, email, address)
VALUES ('Alice', 'alice@email.com', 'NY, USA');

INSERT INTO products (name, price)
VALUES ('Laptop', 1200), ('Mouse', 25);

INSERT INTO orders (customer_id)
VALUES (1);

INSERT INTO order_items (order_id, product_id, quantity)
VALUES
(1, 1, 1),
(1, 2, 2);
```

---

# Part 5: Relationships Explained 🔗

| Relationship           | Type                           |
| ---------------------- | ------------------------------ |
| customers → orders     | One-to-Many                    |
| orders → order_items   | One-to-Many                    |
| products → order_items | One-to-Many                    |
| orders ↔ products      | Many-to-Many (via order_items) |

This is **proper relational modeling**.

---

# Part 6: Query Power (Why This Is Better)

### Total Sales Per Product

```sql
SELECT
    p.name,
    SUM(oi.quantity) AS total_sold
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
GROUP BY p.name;
```

### Orders Per Customer

```sql
SELECT
    c.name,
    COUNT(o.order_id) AS total_orders
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.name;
```

---

# Part 7: Performance Optimization 🚀

## 1️⃣ Index Foreign Keys

PostgreSQL does **NOT** auto-index foreign keys.

```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

## 2️⃣ Use Proper Data Types

* `NUMERIC(10,2)` for money
* `TIMESTAMP` for dates
* `INT` for IDs

## 3️⃣ Avoid Over-Normalization (Later)

Sometimes you’ll add:

* computed columns
* materialized views
* summary tables

But **only after measuring performance**.

---

# Part 8: Final Optimized Schema Summary

```text
customers (1) ────< orders (1) ────< order_items >──── (1) products
```

This design is:
✅ scalable
✅ queryable
✅ maintainable
✅ PostgreSQL-friendly

---

# What We Can Do Next (Your Choice)

1️⃣ Learn **EXPLAIN ANALYZE** to see query performance
2️⃣ Learn **indexes (btree, hash, gin)**
3️⃣ Learn **normal forms (1NF → BCNF)**
4️⃣ Add **payments & shipping tables**
5️⃣ Practice **real optimization with slow queries**

👉 Tell me what you want to tackle next, and I’ll guide you step by step.
