from sqlalchemy import Column, Integer, String, DateTime, Float, BigInteger, func
from sqlalchemy.orm import validates
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    dob = Column(DateTime, nullable=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    @validates("email")
    def validate_email(self, key, email):
        assert "@" in email, "invalid email"
        return email

class Movie(Base):
    __tablename__ = "moviedetails"  # Match actual table name in DB
    rank = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    genre = Column(String, nullable=True)
    description = Column(String, nullable=True)
    director = Column(String, nullable=True)
    actors = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    runtime_minutes = Column(Integer, nullable=True)
    rating = Column(Float, nullable=True)
    votes = Column(BigInteger, nullable=True)
    revenue_millions = Column(Float, nullable=True)
    metascore = Column(Integer, nullable=True)

class WebSeries(Base):
    __tablename__ = "seriesdetails"  # Match actual table name in DB
    series_title = Column(String, primary_key=True, index=True)
    year_released = Column(Integer, nullable=True)
    content_rating = Column(String, nullable=True)
    imdb_rating = Column(Float, nullable=True)
    r_rating = Column(Integer, nullable=True)
    genre = Column(String, nullable=True)
    description = Column(String, nullable=True)
    no_of_seasons = Column(String, nullable=True)
    streaming_platform = Column(String, nullable=True)

class MyList(Base):
    __tablename__ = "mylist"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    item_type = Column(String, nullable=False)  # 'movie' or 'webseries'
    item_id = Column(String, nullable=False)  # title of movie or webseries
