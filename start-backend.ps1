# Start script for Backend API
Write-Host "Starting Sleeper Bus Booking Backend API..." -ForegroundColor Green

# Change to backend directory
Set-Location -Path "$PSScriptRoot\backend"

# Install dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

# Run the server
Write-Host "Starting Express server on port 3000..." -ForegroundColor Green
npm start
