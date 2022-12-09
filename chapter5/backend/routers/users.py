from typing import Tuple, List, Optional

from fastapi import APIRouter, Request, Body, status, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models import UserBase, LoginBase, CurrentUser
from authentication import AuthHandler

router = APIRouter()
auth_handler = AuthHandler()


@router.post(
    "/register",
    response_description="Register user",
    response_model=CurrentUser,
)
async def register(request: Request, newUser: UserBase = Body(...)) -> CurrentUser:
    newUser.password = auth_handler.get_password_hash(newUser.password)
    newUser = jsonable_encoder(newUser)

    existing_email = await request.app.mongodb["users"].find_one(
        {"email": newUser["email"]}
    )
    if existing_email is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with email {newUser['email']} already exists",
        )

    existing_username = await request.app.mongodb["users"].find_one(
        {"username": newUser["username"]}
    )
    if existing_username is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with user name {newUser['username']} already exists",
        )

    insertion_result = await request.app.mongodb["users"].insert_one(newUser)
    created_user = await request.app.mongodb["users"].find_one(
        {"_id": insertion_result.inserted_id}
    )
    created_user = CurrentUser(**created_user).dict()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_user)


@router.post(
    "/login",
    response_description="User login",
)
async def login(request: Request, loginUser: LoginBase = Body(...)) -> str:
    user = await request.app.mongodb["users"].find_one({"email": loginUser.email})
    if (user is None) or (
        not auth_handler.verify_password(loginUser.password, user["password"])
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email/password"
        )

    token = auth_handler.encode_token(user_id=user["_id"])
    return JSONResponse(status_code=status.HTTP_202_ACCEPTED, content={"token": token})


@router.get("/me", response_description="Logged in user data")
async def me(request: Request, userId=Depends(auth_handler.auth_wrapper)):
    currentUser = await request.app.mongodb["users"].find_one({"_id": userId})
    result = CurrentUser(**currentUser).dict()
    result["id"] = userId
    return JSONResponse(status_code=status.HTTP_200_OK, content=result)
