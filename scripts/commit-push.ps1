param(
  [Parameter(Mandatory = $false, Position = 0)]
  [string]$Message = ("chore: save progress ({0:yyyy-MM-dd HH:mm})" -f (Get-Date))
)

$ErrorActionPreference = "Stop"

function Get-GitExecutable {
  $fromPath = Get-Command git -ErrorAction SilentlyContinue
  $candidates = @(
    $(if ($fromPath) { $fromPath.Source }),
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files\Git\bin\git.exe"
  ) | Where-Object { $_ -and (Test-Path $_) }

  if (-not $candidates -or $candidates.Count -eq 0) {
    throw "Git was not found. Install Git for Windows or add git to PATH."
  }

  return $candidates[0]
}

$git = Get-GitExecutable
$repoRoot = Split-Path -Parent $PSScriptRoot

Push-Location $repoRoot
try {
  Write-Host "Staging changes..." -ForegroundColor Cyan
  & $git add .

  $status = & $git status --porcelain
  if (-not $status) {
    Write-Host "Nothing to commit. Pushing existing commits..." -ForegroundColor Yellow
  }
  else {
    Write-Host "Committing with message: $Message" -ForegroundColor Cyan
    & $git -c user.name="Wyatt Wagner" -c user.email="WyattWagner@users.noreply.github.com" commit -m $Message
    if ($LASTEXITCODE -ne 0) {
      throw "git commit failed."
    }
  }

  Write-Host "Pushing to origin..." -ForegroundColor Cyan
  & $git push
  if ($LASTEXITCODE -ne 0) {
    throw "git push failed."
  }

  Write-Host "Done." -ForegroundColor Green
}
finally {
  Pop-Location
}
