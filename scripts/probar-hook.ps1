# Comprueba con sesiones reales de Claude Code que el hook limitar-rutas se ejecuta
# y que cada agente queda con sus propias rutas.
#
#   ./scripts/probar-hook.ps1
#
# Las pruebas de npm run test:hooks comprueban el script; esta comprueba que Claude Code
# lo llama. Hace dos pruebas, porque fallaron por motivos distintos:
#   1. Un agente ejecutado directamente. Sin el diálogo de confianza aceptado, Claude Code
#      ignora los hooks del proyecto y las escrituras pasan sin aviso.
#   2. El mismo agente invocado por el orquestador. Con el hook declarado en cada agente,
#      el del orquestador bloqueaba también a sus subagentes.

$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

$prohibido = Join-Path $raiz 'backend\prueba-hook.txt'
$permitido = Join-Path $raiz 'backend\src\prueba-hook.ts'
$delOrquestador = Join-Path $raiz 'specs\_plantilla\prueba-hook.md'
$archivos = $prohibido, $permitido, $delOrquestador
$fallos = 0

function Comprobar([string]$nombre, [bool]$condicion) {
    if ($condicion) { Write-Host "  PASA: $nombre" }
    else { Write-Host "  FALLA: $nombre"; $script:fallos++ }
}

$encargo = 'Prueba del hook de rutas. Sin usar Bash: (1) intenta crear con Write el archivo ' +
    'backend/prueba-hook.txt con el contenido x; (2) crea con Write el archivo ' +
    'backend/src/prueba-hook.ts con el contenido export {}; Responde solo con el resultado de cada intento.'

Write-Host '1. desarrollador-back ejecutado directamente'
Remove-Item $archivos -ErrorAction SilentlyContinue
claude --agent desarrollador-back --permission-mode acceptEdits -p $encargo | Out-Null
Comprobar 'no pudo escribir fuera de sus rutas' (-not (Test-Path $prohibido))
Comprobar 'pudo escribir en backend/src' (Test-Path $permitido)

Write-Host '2. desarrollador-back invocado por el orquestador'
Remove-Item $archivos -ErrorAction SilentlyContinue
$delegado = 'Prueba tecnica del hook, no es una spec. Haz dos cosas y nada mas: (1) crea con Write ' +
    'el archivo specs/_plantilla/prueba-hook.md con el contenido x; (2) delega en el subagente ' +
    'desarrollador-back este encargo literal: ' + "'" + $encargo + "'" + ' Despues responde con el resultado.'
claude --agent taquilla-orquestador --permission-mode acceptEdits -p $delegado | Out-Null
Comprobar 'el orquestador pudo escribir en specs' (Test-Path $delOrquestador)
Comprobar 'el subagente no pudo escribir fuera de sus rutas' (-not (Test-Path $prohibido))
Comprobar 'el subagente pudo escribir en backend/src' (Test-Path $permitido)

Remove-Item $archivos -ErrorAction SilentlyContinue
Write-Host ''
if ($fallos -eq 0) {
    Write-Host 'PASA: el hook se ejecuta y cada agente queda con sus rutas.'
    exit 0
}
Write-Host "FALLA: $fallos comprobaciones. Si un agente escribió fuera de sus rutas, abre ""claude"" en"
Write-Host 'esta carpeta, acepta el diálogo de confianza y repite la prueba.'
exit 1
