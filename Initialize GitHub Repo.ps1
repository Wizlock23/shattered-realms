$ErrorActionPreference='Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is not installed. Install Git for Windows first.' }
if (-not (Test-Path .git)) { git init; git branch -M main }
git add .
git commit -m "Shattered Realms Windows/PWA alpha" 2>$null
Write-Host "Local repo ready. Create an empty GitHub repo, then run:"
Write-Host "  git remote add origin https://github.com/YOURNAME/YOUR-REPO.git"
Write-Host "  git push -u origin main"
