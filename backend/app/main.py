from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .dependencies import verify_token
from .routers import papers, users, search

#app = FastAPI(dependencies=[Depends(verify_token)])
app = FastAPI()

# Add CORS middleware
origins = [
    'http://localhost:3000',
    '*'
] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(papers.router)
app.include_router(users.router)
app.include_router(search.router)


@app.get("/")
async def root():
    return {"message": "KeepUp!"}