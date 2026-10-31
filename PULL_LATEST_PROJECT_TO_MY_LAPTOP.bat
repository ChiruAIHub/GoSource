@echo off
setlocal
echo ======================================================================
echo  PULL LATEST PROJECT FROM DRIVE D TO THIS LAPTOP
echo ======================================================================
set TARGET_DRIVE=%~d0
set PROJECT_NAME=GoSource
if not exist "%TARGET_DRIVE%\%PROJECT_NAME%" ( set PROJECT_NAME=GoSource )

set "DEST_DIR=%USERPROFILE%\Desktop\gitlaunch-contribution-finder"
if exist "%USERPROFILE%\.gemini\antigravity\scratch\gitlaunch-contribution-finder" (
    set "DEST_DIR=%USERPROFILE%\.gemini\antigravity\scratch\gitlaunch-contribution-finder"
)

echo Source on Drive D: %TARGET_DRIVE%\%PROJECT_NAME%\current
echo Destination on Laptop: %DEST_DIR%
echo.

powershell -ExecutionPolicy Bypass -Command "& { param($src, $dst) if (-not (Test-Path $src)) { Write-Host 'Error: Source on Drive D not found' -ForegroundColor Red; exit 1 }; New-Item -ItemType Directory -Path $dst -Force | Out-Null; $exclude = @('node_modules', '.venv', 'venv', '__pycache__', '.git'); robocopy $src $dst /MIR /R:1 /W:1 /NP /XD $exclude /XF *.pyc *.log *.tmp | Out-Null; Write-Host '>>> PULL SUCCESS! Laptop updated with latest files from Drive D' -ForegroundColor Green } '%TARGET_DRIVE%\%PROJECT_NAME%\current' '%DEST_DIR%'"

echo.
pause


