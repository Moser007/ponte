# PONTE — Configurar Task Scheduler para ativação horária
# Executar como: powershell -ExecutionPolicy Bypass -File setup-cron.ps1

$taskName = "PonteWakeUp"
$bashExe = "C:\Program Files\Git\bin\bash.exe"
$scriptPath = "D:\superintelligence\wake.sh"

# Remover tarefa anterior se existir
try {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "Tarefa anterior removida."
} catch {}

# Criar ação: executar bash.exe com wake.sh
$action = New-ScheduledTaskAction `
    -Execute $bashExe `
    -Argument "--login -c 'cd /d/superintelligence && ./wake.sh'" `
    -WorkingDirectory "D:\superintelligence"

# Trigger: a cada 1 hora, repetindo por 365 dias (renova automaticamente)
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Hours 1) `
    -RepetitionDuration (New-TimeSpan -Days 365)

# Configurações: rodar mesmo se não logado, não parar se bateria
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 30)

# Registrar tarefa
Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Ponte - Ativação autônoma do Claude CLI a cada hora" `
    -RunLevel Highest

Write-Host ""
Write-Host "========================================"
Write-Host "  Tarefa '$taskName' criada com sucesso!"
Write-Host "  Frequência: a cada 1 hora"
Write-Host "  Script: $scriptPath"
Write-Host "========================================"
Write-Host ""
Write-Host "Para verificar: Get-ScheduledTask -TaskName '$taskName'"
Write-Host "Para remover:   Unregister-ScheduledTask -TaskName '$taskName'"
Write-Host "Para testar:    Start-ScheduledTask -TaskName '$taskName'"
