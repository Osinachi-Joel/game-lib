@echo off
echo Starting Game Library Manager...
if not exist .env (
    echo [WARNING] .env file not found! Copying default example...
    copy .env.example .env
)
call npm install
echo.
echo Launching Application...
echo Open http://localhost:3000 in your browser.
npm run dev
pause
