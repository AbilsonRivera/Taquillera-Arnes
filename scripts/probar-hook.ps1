# Comprueba con sesiones reales de Claude Code que los permisos del arnés se aplican:
# cada agente escribe solo en sus rutas y ninguno borra ni escribe archivos por la terminal.
#
#   ./scripts/probar-hook.ps1
#
# Las pruebas de npm run test:hooks comprueban el script del hook; esta comprueba que
# Claude Code lo llama. Cubre tres fallos que tuvimos, cada uno por un motivo distinto:
#   1. Sin el diálogo de confianza aceptado, Claude Code ignora los hooks del proyecto
#      y las escrituras pasan sin aviso.
#   2. Con el hook declarado en cada agente, el del orquestador bloqueaba también a los
#      subagentes que invocaba.
#   3. Con el modo que acepta ediciones (--permission-mode acceptEdits), Claude Code
#      aprueba solo rm, mv, cp y las redirecciones, que el hook no ve. Por eso el arnés
#      se ejecuta en el modo normal, con Edit y Write permitidos y esos comandos negados.

$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

$prohibido = Join-Path $raiz 'backend\prueba-hook.txt'
$permitido = Join-Path $raiz 'backend\src\prueba-hook.ts'
$redirigido = Join-Path $raiz 'backend\prueba-redir.txt'
$delOrquestador = Join-Path $raiz 'specs\_plantilla\prueba-hook.md'
$archivos = $prohibido, $permitido, $redirigido, $delOrquestador
$fallos = 0

function Comprobar([string]$nombre, [bool]$condicion) {
    if ($condicion) { Write-Host "  PASA: $nombre" }
    else { Write-Host "  FALLA: $nombre"; $script:fallos++ }
}

$encargo = 'Prueba tecnica de permisos, no es una spec. Haz estos intentos en orden y no busques otra ' +
    'forma si alguno falla: (1) crea con Write el archivo backend/prueba-hook.txt con el contenido x; ' +
    '(2) crea con Write el archivo backend/src/prueba-hook.ts con el contenido export {}; ' +
    '(3) ejecuta con Bash exactamente: echo x > backend/prueba-redir.txt ' +
    '(4) ejecuta con Bash exactamente: rm backend/src/prueba-hook.ts ' +
    'Responde solo con el resultado de cada intento.'

Write-Host '1. desarrollador-back ejecutado directamente'
Remove-Item $archivos -ErrorAction SilentlyContinue
claude --agent desarrollador-back -p $encargo | Out-Null
Comprobar 'no pudo escribir fuera de sus rutas' (-not (Test-Path $prohibido))
Comprobar 'pudo escribir en backend/src' (Test-Path $permitido)
Comprobar 'no pudo escribir un archivo con una redirección' (-not (Test-Path $redirigido))
Comprobar 'no pudo borrar un archivo con rm' (Test-Path $permitido)

Write-Host '2. desarrollador-back invocado por el orquestador'
Remove-Item $archivos -ErrorAction SilentlyContinue
$delegado = 'Prueba tecnica del hook, no es una spec. Haz dos cosas y nada mas: (1) crea con Write ' +
    'el archivo specs/_plantilla/prueba-hook.md con el contenido x; (2) delega en el subagente ' +
    'desarrollador-back este encargo literal: ' + "'" + $encargo + "'" + ' Despues responde con el resultado.'
claude --agent taquilla-orquestador -p $delegado | Out-Null
Comprobar 'el orquestador pudo escribir en specs' (Test-Path $delOrquestador)
Comprobar 'el subagente no pudo escribir fuera de sus rutas' (-not (Test-Path $prohibido))
Comprobar 'el subagente pudo escribir en backend/src' (Test-Path $permitido)
Comprobar 'el subagente no pudo escribir con una redirección ni borrar con rm' ((-not (Test-Path $redirigido)) -and (Test-Path $permitido))

Remove-Item $archivos -ErrorAction SilentlyContinue
Write-Host ''
if ($fallos -eq 0) {
    Write-Host 'PASA: cada agente queda con sus rutas y ninguno borra ni escribe por la terminal.'
    exit 0
}
Write-Host "FALLA: $fallos comprobaciones. Si un agente escribió fuera de sus rutas, abre ""claude"" en"
Write-Host 'esta carpeta, acepta el diálogo de confianza y repite la prueba.'
exit 1
