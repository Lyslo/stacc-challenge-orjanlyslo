from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    id: str
    username: str
    email: str
    date_of_birth: date
    created_at: datetime
    updated_at: datetime

class UserCreate(BaseModel):
    username: str
    email: str
    date_of_birth: date 