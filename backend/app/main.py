from fastapi import Depends, FastAPI

from .dependencies import verify_token
from .routers import papers, users

#app = FastAPI(dependencies=[Depends(verify_token)])
app = FastAPI()


app.include_router(papers.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "KeepUp!"}