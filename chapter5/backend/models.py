from enum import Enum
from bson import ObjectId
from pydantic import Field, BaseModel, EmailStr, validator
from typing import Optional
from email_validator import validate_email, EmailNotValidError


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return cls(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class MongoBaseModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        json_encoders = {ObjectId: str}


class Role(str, Enum):
    SALESPERSON = "SALESPERSON"
    ADMIN = "ADMIN"


class UserBase(MongoBaseModel):
    username: str = Field(..., min_length=3, max_length=15)
    email: str = EmailStr(...)
    password: str = Field(...)
    role: Role

    @validator("email")
    def valid_email(cls, v):
        try:
            email = validate_email(v).email
            return email
        except EmailNotValidError as e:
            raise EmailNotValidError


class LoginBase(BaseModel):
    email: str = EmailStr(...)
    password: str = Field(...)


class CurrentUser(BaseModel):
    email: str = EmailStr(...)
    username: str = Field(...)
    role: str = Field(...)


class CarBase(MongoBaseModel):
    brand: str = Field(..., min_length=3)
    make: str = Field(..., min_length=3)
    year: int = Field(..., gt=1975, lt=2023)
    price: int = Field(...)
    km: int = Field(...)
    cm3: int = Field(...)


class CarUpdate(MongoBaseModel):
    price: Optional[int] = None


class CarDB(CarBase):
    owner: str = Field(...)


if __name__ == "__main__":
    m = MongoBaseModel()
    print(f"{m=}")
    print(f"{m.id=}")
    print(f"{m.schema()=}")
