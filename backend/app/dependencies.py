from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer
import jwt
from dotenv import load_dotenv
import os

load_dotenv()
# Initialize Supabase client (replace with your Supabase URL and Key)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


security = HTTPBearer()

def verify_token(http_authorization_credentials=Security(security)):
    token = http_authorization_credentials.credentials
    try:
        # Decode JWT token
        decoded_token = jwt.decode(token, SUPABASE_KEY, algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")