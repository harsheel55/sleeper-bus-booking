# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\frontend"
npm run dev
