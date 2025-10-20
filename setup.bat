@echo off
echo ================================
echo iTailor Setup Script
echo ================================
echo.

echo Step 1: Creating .env file...
cd backend
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your MySQL password.
    echo.
) else (
    echo .env file already exists.
    echo.
)

echo Step 2: Database setup instructions...
echo Please run these commands in MySQL:
echo   CREATE DATABASE IF NOT EXISTS itailor_db;
echo   USE itailor_db;
echo   SOURCE database/schema.sql;
echo.
echo Or run: mysql -u root -p itailor_db ^< database/schema.sql
echo.

pause

echo Step 3: Seeding database with 200+ records...
call npm run seed
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Start backend: npm start
echo 2. Start frontend: cd ../frontend ^&^& npm start
echo 3. Open browser: http://localhost:4200
echo.
pause
