# Start script for ML API
Write-Host "Starting Sleeper Bus Booking ML API..." -ForegroundColor Green

# Change to ml-model directory
Set-Location -Path "$PSScriptRoot\ml-model"

# Activate virtual environment if exists
$venvPath = "$PSScriptRoot\.venv\Scripts\Activate.ps1"
if (Test-Path $venvPath) {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & $venvPath
}

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Run the Flask app
Write-Host "Starting Flask API on port 5000..." -ForegroundColor Green
python app.py
