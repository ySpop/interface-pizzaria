@echo off

:: Inicie o servidor
start npm run devStart

timeout /t 25 /nobreak > NUL

start http://localhost:3000
