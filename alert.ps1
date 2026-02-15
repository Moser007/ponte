# PONTE — Alerta sonoro para Giovanni
# Toca 3 beeps crescentes para chamar atenção

[console]::beep(600, 300)
Start-Sleep -Milliseconds 100
[console]::beep(800, 300)
Start-Sleep -Milliseconds 100
[console]::beep(1000, 500)

# Notificação Windows (toast) se possível
try {
    [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms") | Out-Null
    $notify = New-Object System.Windows.Forms.NotifyIcon
    $notify.Icon = [System.Drawing.SystemIcons]::Information
    $notify.BalloonTipTitle = "Ponte"
    $notify.BalloonTipText = "Ponte precisa da sua atenção!"
    $notify.BalloonTipIcon = "Info"
    $notify.Visible = $true
    $notify.ShowBalloonTip(5000)
    Start-Sleep -Seconds 6
    $notify.Dispose()
} catch {
    # Falha silenciosa se toast não funcionar
}
