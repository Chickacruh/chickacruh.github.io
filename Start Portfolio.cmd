@echo off
cd /d "%~dp0"
set "NODE_EXE=C:\Users\Andrew\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
powershell.exe -NoProfile -Command "try { $r=Invoke-WebRequest http://localhost:4173 -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1"
if not errorlevel 1 goto open
start "Portfolio server" /min "%NODE_EXE%" "%~dp0server.cjs"
timeout /t 2 /nobreak >nul
:open
start "" "http://localhost:4173"
