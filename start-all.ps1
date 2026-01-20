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
Write-Host "Starting Backend API (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\start-backend.ps1"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Services Starting...                 " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nBackend API: http://localhost:3000" -ForegroundColor White
Write-Host "ML API:      http://localhost:5000" -ForegroundColor White
Write-Host "`nAPI Endpoints:" -ForegroundColor Yellow
Write-Host "  GET  /api/health     - Health check"
Write-Host "  GET  /api/stations   - Get all stations"
Write-Host "  GET  /api/seats      - Get available seats"
Write-Host "  GET  /api/meals      - Get meal options"
Write-Host "  POST /api/bookings   - Create booking"
Write-Host "  POST /api/predict    - Get confirmation prediction"
