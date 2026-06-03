$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Stopping processes on port 3001..."
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue |
  Where-Object { $_.OwningProcess -gt 0 } |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

Write-Host "npm install..."
npm.cmd install

Write-Host "build:packages..."
npm.cmd run build:packages

Push-Location apps\api
Write-Host "prisma generate..."
npx prisma generate
Write-Host "prisma migrate deploy..."
npx prisma migrate deploy
Write-Host "db:seed..."
npm.cmd run db:seed
Pop-Location

Write-Host ""
Write-Host "Done. Start servers in two terminals:"
Write-Host "  npm.cmd run dev:api"
Write-Host "  npm.cmd run dev:web"
Write-Host ""
Write-Host "API health: http://localhost:3001/health"
Write-Host "Web UI:     http://localhost:5173"
