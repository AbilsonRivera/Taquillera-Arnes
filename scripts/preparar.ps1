# Prepara el espacio de trabajo del arnés: clona los dos repositorios de la aplicación
# como backend/ y frontend/ e instala las dependencias de todo.
#
#   ./scripts/preparar.ps1

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

$repositorios = @{
    backend  = 'https://github.com/Bredman01/Taquillera-Backend.git'
    frontend = 'https://github.com/Bredman01/TaquilleraFrontend.git'
}

foreach ($carpeta in $repositorios.Keys) {
    if (Test-Path (Join-Path $raiz $carpeta)) {
        Write-Host "$carpeta ya existe; no se vuelve a clonar."
    }
    else {
        git clone $repositorios[$carpeta] $carpeta
        if ($LASTEXITCODE -ne 0) { throw "No se pudo clonar $carpeta." }
    }
}

foreach ($carpeta in 'backend', 'frontend', 'herramientas') {
    Write-Host "Instalando dependencias de $carpeta..."
    Push-Location (Join-Path $raiz $carpeta)
    try {
        npm ci --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw "npm ci falló en $carpeta." }
    }
    finally {
        Pop-Location
    }
}

# Los commits de los dos repositorios pasan por scripts/git-hooks/commit-msg, que quita
# del mensaje cualquier línea de atribución a una herramienta.
$ganchos = (Join-Path $raiz 'scripts\git-hooks').Replace('\', '/')
foreach ($carpeta in 'backend', 'frontend') {
    git -C (Join-Path $raiz $carpeta) config core.hooksPath $ganchos
}

Write-Host ''
Write-Host 'Listo. Para ejecutar una spec: claude --agent taquilla-orquestador'
