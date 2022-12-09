import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta


class AuthHandler:
    security = HTTPBearer()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    secret = "FARMSTACKsecretString"

    def get_password_hash(self, pwd):
        return self.pwd_context.hash(pwd)

    def verify_password(self, plain_pwd, hashed_pwd):
        return self.pwd_context.verify(plain_pwd, hashed_pwd)

    def encode_token(self, user_id):
        payload = {
            "exp": datetime.utcnow() + timedelta(days=0, hours=0, minutes=35),
            "iat": datetime.utcnow(),
            "sub": user_id,
        }
        return jwt.encode(payload=payload, key=self.secret, algorithm="HS256")

    def decode_token(self, token):
        try:
            payload = jwt.decode(jwt=token, key=self.secret, algorithms="HS256")
            return payload["sub"]
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Signature expired"
            )
        except jwt.InvalidSignatureError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )

    def auth_wrapper(self, auth: HTTPAuthorizationCredentials = Security(security)):
        return self.decode_token(auth.credentials)
