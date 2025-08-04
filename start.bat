@echo off
chcp 65001 >nul
echo ========================================
echo    AMD PPM Dashboard Startup Script
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js not found. Please install Node.js first.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo Checking project dependencies...

echo 📦 Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo 📦 Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo ✅ All dependencies installed successfully

echo.
echo 🚀 Starting development servers...
echo 📊 Backend API: http://localhost:5000
echo 🌐 Frontend App: http://localhost:3000
echo.

call npm run dev

pause 