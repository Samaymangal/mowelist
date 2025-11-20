import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel

from dotenv import load_dotenv

try:
    from .database import Base, engine, get_db
    from .models import User, Movie, WebSeries, MyList
    from .schemas import RegisterRequest, LoginRequest, TokenResponse, UserOut
    from .auth import hash_password, verify_password, create_access_token, decode_token
except ImportError:
    # For direct script execution
    from app.database import Base, engine, get_db
    from app.models import User, Movie, WebSeries, MyList
    from app.schemas import RegisterRequest, LoginRequest, TokenResponse, UserOut
    from app.auth import hash_password, verify_password, create_access_token, decode_token

load_dotenv()

# Create tables on startup (simple for demo)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth API (FastAPI + PostgreSQL)")

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

@app.get("/movies")
def get_movies(db: Session = Depends(get_db)):
    movies = db.query(Movie).all()
    return movies

@app.get("/webseries")
def get_webseries(db: Session = Depends(get_db)):
    webseries = db.query(WebSeries).all()
    return webseries

bearer_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = credentials.credentials
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    email = payload["sub"]
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

class AddToListRequest(BaseModel):
    item_type: str
    item_id: str

@app.post("/add_to_list")
def add_to_list(req: AddToListRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(MyList).filter(MyList.user_id == user.id, MyList.item_type == req.item_type, MyList.item_id == req.item_id).first()
    if existing:
        return {"message": "Already in list"}
    mylist_item = MyList(user_id=user.id, item_type=req.item_type, item_id=req.item_id)
    db.add(mylist_item)
    db.commit()
    return {"message": "Added to list"}

@app.post("/remove_from_list")
def remove_from_list(req: AddToListRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(MyList).filter(MyList.user_id == user.id, MyList.item_type == req.item_type, MyList.item_id == req.item_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Item not in list")
    db.delete(existing)
    db.commit()
    return {"message": "Removed from list"}

@app.get("/my_list")
def get_my_list(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(MyList).filter(MyList.user_id == user.id).all()
    return items

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=UserOut)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == req.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username already exists
    existing_username = db.query(User).filter(User.username == req.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Convert string date to datetime object
    from datetime import datetime
    dob_date = datetime.strptime(req.dob, "%Y-%m-%d") if req.dob else None
    
    user = User(
        email=req.email,
        username=req.username,
        name=req.name,
        dob=dob_date,
        password_hash=hash_password(req.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post("/auth/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(subject=user.email, expires_minutes=60*8)
    return TokenResponse(access_token=token)

@app.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
