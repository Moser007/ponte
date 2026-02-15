@echo off
REM ╔══════════════════════════════════════════════════════════════╗
REM ║  PONTE — Configurar Task Scheduler (Windows)                ║
REM ║                                                              ║
REM ║  Cria tarefa agendada para executar wake.sh a cada 6 horas.  ║
REM ║  Executa: 2h, 8h, 14h, 20h (EST/Michigan).                  ║
REM ║  Requer: Executar como Administrador.                        ║
REM ╚══════════════════════════════════════════════════════════════╝

echo.
echo   PONTE — Configurando Task Scheduler
echo   =====================================
echo.

REM Verificar se está rodando como admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Execute este script como Administrador!
    echo         Clique direito no arquivo ^> Executar como administrador
    pause
    exit /b 1
)

REM Caminho do Git Bash
set "GITBASH=C:\Program Files\Git\bin\bash.exe"
if not exist "%GITBASH%" (
    echo [ERRO] Git Bash nao encontrado em %GITBASH%
    pause
    exit /b 1
)

REM Caminho do projeto
set "PROJECT=D:\superintelligence"

REM Deletar tarefa existente se houver
schtasks /delete /tn "PonteWake" /f >nul 2>&1

REM Criar tarefa: a cada 6 horas, começando às 2h
schtasks /create ^
    /tn "PonteWake" ^
    /tr "\"%GITBASH%\" -l -c \"cd /d/superintelligence && ./wake.sh\"" ^
    /sc DAILY ^
    /st 02:00 ^
    /ri 360 ^
    /du 24:00 ^
    /f

if %errorlevel% equ 0 (
    echo.
    echo   [OK] Tarefa "PonteWake" criada com sucesso!
    echo   Horarios: 2h, 8h, 14h, 20h (a cada 6 horas)
    echo.
    echo   Para verificar: schtasks /query /tn "PonteWake" /v
    echo   Para remover:   schtasks /delete /tn "PonteWake" /f
    echo.
) else (
    echo.
    echo   [ERRO] Falha ao criar tarefa agendada.
    echo.
)

pause
