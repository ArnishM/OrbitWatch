from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import routes
import os

app = FastAPI(title="OrbitWatch API", description="Turning Satellite Data into SDG Action")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to OrbitWatch API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
