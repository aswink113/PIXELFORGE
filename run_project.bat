@echo off
echo ===================================================
echo   Starting PIXELFORGE Backend and Frontend...
echo ===================================================

:: Start backend in a new window
echo Starting backend server (FastAPI)...
start "PIXELFORGE Backend" cmd /k "cd backend && venv\Scripts\activate.bat && python main.py"

:: Start frontend in a new window
echo Starting frontend server (Vite)...
start "PIXELFORGE Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are starting up.
echo Backend URL: http://localhost:8000
echo Frontend URL: http://localhost:5173
echo Admin Panel: http://localhost:5173/admin (Credentials: admin / admin)
echo ===================================================
pause
