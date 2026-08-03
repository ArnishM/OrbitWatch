@echo off
echo ==================================================
echo   Starting OrbitWatch Development Environment
echo ==================================================

echo [1/2] Starting Backend Server (FastAPI)...
start "OrbitWatch Backend" cmd /k "call venv\Scripts\activate && python -m uvicorn backend.main:app --reload --port 8000"

echo [2/2] Starting Frontend Server (Vite)...
start "OrbitWatch Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting up in separate windows.
echo - Backend API: http://localhost:8000
echo - Frontend UI: Typically http://localhost:5173
echo.
echo Press any key to exit this launcher...
pause > nul
