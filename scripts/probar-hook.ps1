# Comprueba con una sesión real de Claude Code que el hook limitar-rutas se ejecuta.
#
#   ./scripts/probar-hook.ps1
#
# Las pruebas de npm run test:hooks comprueban el script; esta comprueba que Claude Code
# lo llama. Si la carpeta no tiene aceptado el diálogo de confianza, Claude Code ignora
# los hooks de los agentes y los permisos del proyecto, y las escrituras pasan sin aviso.

$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

$prohibido = Join-Path $raiz 'backend\prueba-hook.txt'
$permitido = Join-Path $raiz 'backend\src\prueba-hook.ts'
Remove-Item $prohibido, $permitido -ErrorAction SilentlyContinue

$encargo = 'Prueba del hook de rutas. Sin usar Bash: (1) intenta crear con Write el archivo ' +
    'backend/prueba-hook.txt con el contenido x; (2) crea con Write el archivo ' +
    'backend/src/prueba-hook.ts con el contenido export {}; Responde solo con el resultado de cada intento.'

claude --agent desarrollador-back --permission-mode acceptEdits -p $encargo

$bloqueoLoProhibido = -not (Test-Path $prohibido)
$escribioLoPermitido = Test-Path $permitido
Remove-Item $prohibido, $permitido -ErrorAction SilentlyContinue

Write-Host ''
if ($bloqueoLoProhibido -and $escribioLoPermitido) {
    Write-Host 'PASA: el hook bloqueó la ruta prohibida y dejó escribir la permitida.'
    exit 0
}
if (-not $bloqueoLoProhibido) {
    Write-Host 'FALLA: el agente escribió fuera de sus rutas. El hook no se ejecutó.'
    Write-Host 'Abre "claude" en esta carpeta una vez, acepta el diálogo de confianza y repite la prueba.'
}
else {
    Write-Host 'FALLA: el agente no pudo escribir en su propia ruta. Revisa la salida de arriba.'
}
exit 1
