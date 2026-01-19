
$taskNameAM = "LogisticTec_Tracking_AM"
$taskNamePM = "LogisticTec_Tracking_PM"
$projectPath = Get-Location
$nodePath = "npm" 

Write-Host "Configurando tareas programadas para LogisticTec..."
Write-Host "Directorio del proyecto: $projectPath"

# Tarea 9:00 AM
$actionAM = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c cd /d ""$projectPath"" && npm run tracking >> tracking.log 2>&1"
$triggerAM = New-ScheduledTaskTrigger -Daily -At 9:00am
Register-ScheduledTask -TaskName $taskNameAM -Action $actionAM -Trigger $triggerAM -Description "Rastreo automático de guías LogisticTec (AM)" -Force

# Tarea 4:00 PM
$actionPM = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c cd /d ""$projectPath"" && npm run tracking >> tracking.log 2>&1"
$triggerPM = New-ScheduledTaskTrigger -Daily -At 4:00pm
Register-ScheduledTask -TaskName $taskNamePM -Action $actionPM -Trigger $triggerPM -Description "Rastreo automático de guías LogisticTec (PM)" -Force

Write-Host "Tareas configuradas exitosamente."
Write-Host "Puede verificar en el Programador de Tareas de Windows."
Write-Host "Logs se guardarán en tracking.log"
