

# ✅ SOLID Principles in Python (with FastAPI Use Cases)

---

## 🔹 1. Single Responsibility Principle (SRP)

### 📌 Definition

> **A class should have only one reason to change.**

Each class should focus on **one responsibility**.

---

### ❌ Bad Example (Violates SRP)

```python
class UserService:
    def create_user(self, user_data):
        # business logic
        print("Validating user")

        # database logic
        print("Saving user to database")

        # logging
        print("User created")
```

**Problems:**

* Business logic
* Database access
* Logging
  ➡ All mixed in one class

---

### ✅ Good Example (Follows SRP)

```python
class UserRepository:
    def save(self, user):
        print("Saving user to database")


class UserLogger:
    def log(self, message):
        print(message)


class UserService:
    def __init__(self, repo: UserRepository, logger: UserLogger):
        self.repo = repo
        self.logger = logger

    def create_user(self, user):
        print("Validating user")
        self.repo.save(user)
        self.logger.log("User created")
```

---

### 🚀 FastAPI Use Case (SRP)

```python
# repository.py
class UserRepository:
    def create(self, user):
        return {"id": 1, **user}


# service.py
class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    def create_user(self, user):
        return self.repo.create(user)


# router.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/users")
def create_user(user: dict):
    service = UserService(UserRepository())
    return service.create_user(user)
```

✅ Each layer has **one responsibility**

---

## 🔹 2. Open/Closed Principle (OCP)

### 📌 Definition

> **Open for extension, closed for modification**

You should add new behavior **without changing existing code**.

---

### ❌ Bad Example

```python
class PaymentProcessor:
    def pay(self, method, amount):
        if method == "credit":
            print("Paying with credit card")
        elif method == "paypal":
            print("Paying with PayPal")
```

❌ Adding a new method requires modifying this class.

---

### ✅ Good Example (Using Polymorphism)

```python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount: float):
        pass


class CreditCardPayment(PaymentMethod):
    def pay(self, amount):
        print(f"Paid {amount} using Credit Card")


class PaypalPayment(PaymentMethod):
    def pay(self, amount):
        print(f"Paid {amount} using PayPal")


class PaymentProcessor:
    def process(self, payment: PaymentMethod, amount: float):
        payment.pay(amount)
```

➡ Add new payment methods **without touching existing code**

---

### 🚀 FastAPI Use Case (OCP)

```python
def get_payment_method(method: str) -> PaymentMethod:
    if method == "credit":
        return CreditCardPayment()
    return PaypalPayment()

@app.post("/pay")
def pay(method: str, amount: float):
    payment = get_payment_method(method)
    processor = PaymentProcessor()
    processor.process(payment, amount)
    return {"status": "success"}
```

---

## 🔹 3. Liskov Substitution Principle (LSP)

### 📌 Definition

> **Subclasses must be substitutable for their parent classes**

If `B` extends `A`, then `A` should work correctly when replaced by `B`.

---

### ❌ Bad Example

```python
class Bird:
    def fly(self):
        print("Flying")


class Penguin(Bird):
    def fly(self):
        raise Exception("Penguins can't fly")
```

❌ Breaks expected behavior

---

### ✅ Good Example

```python
class Bird:
    pass


class FlyingBird(Bird):
    def fly(self):
        print("Flying")


class Penguin(Bird):
    def swim(self):
        print("Swimming")
```

✔ No broken expectations

---

### 🚀 FastAPI Use Case (LSP)

```python
def make_bird_move(bird: Bird):
    if isinstance(bird, FlyingBird):
        bird.fly()
```

---

## 🔹 4. Interface Segregation Principle (ISP)

### 📌 Definition

> **Clients should not be forced to depend on methods they don’t use**

Use **small, focused interfaces**.

---

### ❌ Bad Example

```python
class Machine:
    def print(self): pass
    def scan(self): pass
    def fax(self): pass


class Printer(Machine):
    def print(self): print("Printing")
    def scan(self): pass
    def fax(self): pass
```

❌ Printer doesn’t need scan or fax

---

### ✅ Good Example

```python
from abc import ABC, abstractmethod

class Printable(ABC):
    @abstractmethod
    def print(self): pass


class Scannable(ABC):
    @abstractmethod
    def scan(self): pass


class Printer(Printable):
    def print(self):
        print("Printing")
```

---

### 🚀 FastAPI Use Case (ISP)

```python
class Readable(ABC):
    @abstractmethod
    def read(self): pass


class Writable(ABC):
    @abstractmethod
    def write(self): pass
```

Different APIs can depend only on what they need.

---

## 🔹 5. Dependency Inversion Principle (DIP)

### 📌 Definition

> **High-level modules should depend on abstractions, not concrete classes**

---

### ❌ Bad Example

```python
class PostgreSQL:
    def connect(self):
        print("PostgreSQL connected")


class UserService:
    def __init__(self):
        self.db = PostgreSQL()
```

❌ Hard dependency

---

### ✅ Good Example

```python
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def connect(self): pass


class PostgreSQL(Database):
    def connect(self):
        print("PostgreSQL connected")


class UserService:
    def __init__(self, db: Database):
        self.db = db
```

---

### 🚀 FastAPI Use Case (DIP with Dependency Injection)

```python
def get_db() -> Database:
    return PostgreSQL()


@app.get("/users")
def get_users(db: Database = Depends(get_db)):
    db.connect()
    return {"users": []}
```

✔ Loose coupling
✔ Easy testing
✔ Easy replacement

---

## 🔥 SOLID + FastAPI Architecture (Ideal)

```
app/
├── routers/
├── services/
├── repositories/
├── models/
├── interfaces/
```

Each layer:

* **SRP** → One responsibility
* **OCP** → Extend via interfaces
* **LSP** → Safe substitutions
* **ISP** → Small interfaces
* **DIP** → Dependency injection

---

## 🎯 One-Line Interview Answer

> **SOLID principles are object-oriented design guidelines that promote clean architecture by enforcing single responsibility, extensibility, safe inheritance, interface separation, and dependency inversion.**

---

If you want, I can also provide:
✅ **SOLID with real FastAPI project structure**
✅ **SOLID interview questions**
✅ **SOLID violations & refactoring examples**
✅ **Unit testing with SOLID**

Just tell me 👍
