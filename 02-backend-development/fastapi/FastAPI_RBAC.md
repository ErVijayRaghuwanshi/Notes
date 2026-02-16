Below is a clean, production-ready pattern for JWT authentication with role-based access control (RBAC) in FastAPI using PostgreSQL.

I’ll use:

FastAPI

SQLAlchemy 2.0

PostgreSQL

JWT (python-jose)

Password hashing (passlib)



---

1️⃣ Install dependencies

pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose passlib[bcrypt] python-multipart


---

2️⃣ Database setup (PostgreSQL)

database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "postgresql://user:password@localhost:5432/mydb"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


---

3️⃣ User model with roles

models.py

from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")  # user | admin | manager


---

4️⃣ Password hashing & JWT utilities

security.py

from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext

SECRET_KEY = "SUPER_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


---

5️⃣ Authentication dependencies

auth.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from database import get_db
from models import User
from security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401)

    return user


---

6️⃣ Role-based access dependency (RBAC)

roles.py

from fastapi import Depends, HTTPException, status
from auth import get_current_user

def require_role(*roles: str):
    def role_checker(user=Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return user
    return role_checker


---

7️⃣ Login endpoint

main.py

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import User
from security import verify_password, create_access_token
from roles import require_role
from auth import get_current_user

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        data={"sub": user.username, "role": user.role}
    )

    return {"access_token": token, "token_type": "bearer"}


---

8️⃣ Protected routes with roles

@app.get("/profile")
def profile(user=Depends(get_current_user)):
    return {"username": user.username, "role": user.role}


@app.get("/admin")
def admin_only(user=Depends(require_role("admin"))):
    return {"message": "Admin access granted"}


@app.get("/manager")
def manager_or_admin(user=Depends(require_role("manager", "admin"))):
    return {"message": "Manager or Admin access"}


---

9️⃣ JWT payload example

{
  "sub": "john",
  "role": "admin",
  "exp": 1700000000
}


---

🔐 Security Best Practices

✔ Store SECRET_KEY in environment variables
✔ Use short-lived access tokens
✔ Add refresh tokens for production
✔ Use Alembic migrations
✔ Consider UUIDs instead of integer IDs


---

📦 Want more?

I can also provide:

🔁 Refresh token flow

🧱 Role/Permission tables (many-to-many)

🧪 Pytest auth tests

🔒 OAuth2 + scopes

🚀 Async SQLAlchemy version


Just tell me 👍