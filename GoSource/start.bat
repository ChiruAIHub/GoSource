@echo off
echo ==================================================
echo Starting GoSource Platform...
echo ==================================================
cd /d "%~dp0"
start http://localhost:5173
python server.py
pause

