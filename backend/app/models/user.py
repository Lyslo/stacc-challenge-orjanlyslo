from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel
from uuid import UUID

class User(BaseModel):
    id: UUID
    username: str
    email: str
    date_of_birth: date
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: str
    date_of_birth: date 