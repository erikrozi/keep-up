from typing import Union

from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing_extensions import Annotated

from .routers import papers, users

app = FastAPI()

app.include_router(papers.router)
@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}