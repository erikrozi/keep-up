from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .dependencies import verify_token
from .routers import papers, users

#app = FastAPI(dependencies=[Depends(verify_token)])
app = FastAPI()

# Add CORS middleware
origins = [
    'http://localhost:3000',
] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins
)

app.include_router(papers.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "KeepUp!"}