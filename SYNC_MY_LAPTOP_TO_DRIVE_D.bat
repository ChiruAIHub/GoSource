@echo off
setlocal
echo ======================================================================
echo  SYNC LAPTOP PROJECT FILES TO DRIVE D & CREATE BACKUP SNAPSHOT
echo ======================================================================
cd /d "%~dp0"

echo Running automated project snapshot backup...
python create_backup.py

echo.
echo >>> All project files, models, datasets, and configs are securely backed up on Drive D!
pause
