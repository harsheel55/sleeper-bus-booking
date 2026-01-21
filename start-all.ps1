# Sleeper Bus Booking System - Start All Services
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sleeper Bus Booking System Launcher  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Start ML API in new terminal
Write-Host "`nStarting ML API (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-ml.ps1"

# Wait for ML API to start
Write-Host "Waiting for ML API to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Backend in new terminal
Write-Host "Starting Backend API (Port 5001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-backend.ps1"

# Wait for Backend to start
Write-Host "Waiting for Backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start Frontend in new terminal
Write-Host "Starting Frontend (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-frontend.ps1"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  All Services Starting...             " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nFrontend:    http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:5001" -ForegroundColor White
Write-Host "ML API:      http://localhost:5000" -ForegroundColor White
Write-Host "`nOpen http://localhost:3000 in your browser" -ForegroundColor Green
