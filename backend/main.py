from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="OrbitWatch API", description="Turning Satellite Data into SDG Action")

# CORS config — restrict to known frontend origins only
ALLOWED_ORIGINS = [
    "https://watchorbit.netlify.app",  # Production frontend
    "http://localhost:5173",           # Vite dev server
    "http://localhost:3000",           # Alternative local port
]

# Allow extra origins from environment variable (useful for staging)
extra = os.getenv("EXTRA_CORS_ORIGINS", "")
if extra:
    ALLOWED_ORIGINS += [o.strip() for o in extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],   # This API is read-only
    allow_headers=["*"],
)


app.include_router(routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to OrbitWatch API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
