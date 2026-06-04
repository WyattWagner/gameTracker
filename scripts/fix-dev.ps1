$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Stopping processes on port 3001..."
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue |
  Where-Object { $_.OwningProcess -gt 0 } |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

$envFile = Join-Path $root "apps\api\.env"
$envExample = Join-Path $root "apps\api\.env.example"
if (-not (Test-Path $envFile)) {
  Copy-Item $envExample $envFile
  Write-Host "Created apps/api/.env from .env.example"
}

$docker = Get-Command docker -ErrorAction SilentlyContinue
$usePostgres = $false
$prismaSchema = "prisma\schema.prisma"

if ($docker) {
  Write-Host "Docker found - starting local PostgreSQL..."
  docker compose up -d postgres
  if ($LASTEXITCODE -ne 0) {
    throw "docker compose failed."
  }

  $ready = $false
  for ($i = 0; $i -lt 30; $i++) {
    docker compose exec -T postgres pg_isready -U postgres -d gametracker 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
      $ready = $true
      break
    }
    Start-Sleep -Seconds 1
  }
  if (-not $ready) {
    throw "PostgreSQL did not become ready in time."
  }

  $usePostgres = $true
  $prismaSchema = "prisma\schema.postgres.prisma"
  Set-Content -Path $envFile -Value @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gametracker?schema=public"
JWT_SECRET="dev-secret-change-me"
PORT=3001
"@
} else {
  $envContent = Get-Content $envFile -Raw
  if ($envContent -match 'postgresql://' -and $envContent -notmatch '@localhost:5432') {
    Write-Host "Docker not found - using hosted DATABASE_URL from apps/api/.env"
    $usePostgres = $true
    $prismaSchema = "prisma\schema.postgres.prisma"
  } else {
    Write-Host "Docker not found - using local SQLite (apps/api/prisma/dev.db)..."
    Set-Content -Path $envFile -Value @"
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-change-me"
PORT=3001
"@
  }
}

Write-Host "npm install..."
npm.cmd install

Write-Host "build:packages..."
npm.cmd run build:packages

Push-Location apps\api
Write-Host "prisma generate ($prismaSchema)..."
npx prisma generate --schema $prismaSchema
Write-Host "prisma migrate deploy..."
npx prisma migrate deploy --schema $prismaSchema
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
Write-Host ""
if (-not $usePostgres) {
  Write-Host "Local SQLite mode. Production deploy uses PostgreSQL - see DEPLOY.md"
}
