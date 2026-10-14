@echo off
title PulseLead SMB Server
echo ===================================================
echo Starting PulseLead SMB Full-Stack Python Backend...
echo ===================================================
timeout /t 1 >nul
start http://localhost:8080
python server.py
pause
