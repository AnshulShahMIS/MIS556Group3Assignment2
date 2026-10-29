@echo off
setlocal
if not exist "%~dp0Setup-API-Key.ps1" (
  echo Extract the complete ZIP before running setup.
  pause
  exit /b 1
)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Setup-API-Key.ps1"
pause
