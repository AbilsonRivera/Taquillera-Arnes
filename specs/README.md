# Specs de Taquillera

Desarrollo guiado por especificaciones con estructura propia. No usamos Spec Kit: nuestro flujo ya era historia, plan revisado y matriz criterio → prueba, y lo completamos con los tres documentos que pide el proyecto integrador.

## Estructura de una spec

```
specs/NNN-nombre/
  spec.md        Qué se construye y por qué, con criterios de aceptación (CA-1, CA-2...)
  plan.md        Cómo: decisiones técnicas, archivos, contrato y matriz criterio → prueba
  tareas.md      El trabajo en pasos, marcados al completarse
  evidencia/
    traza.md     Cada delegación del orquestador, con su resultado y su commit
    contrato.md  Informe del guardian-contrato
    revision.md  Informe del revisor, con la mutación del backend y nuestras decisiones sobre los hallazgos
    ui.md, ui/   Informe del verificador-ui, con sus capturas, axe y consola
    interaccion.md, interaccion/
                 Salida de las pruebas de teclado de herramientas/recorridos/, con sus capturas
```

| Documento | Quién lo escribe | Cuándo |
|---|---|---|
| `spec.md` | El desarrollador, con la skill `nueva-spec` | Antes de empezar |
| `plan.md` | El `planificador` lo redacta y el orquestador lo guarda | Antes de cualquier código; lo aprueba el desarrollador |
| `tareas.md` | El orquestador | Al aprobarse el plan; se marca en cada paso |
| `evidencia/` | El orquestador, con los informes de los controles. `interaccion.md` lo guardamos nosotros al ejecutar las pruebas de teclado | Durante el flujo |

## Ciclo de vida

1. El desarrollador escribe `spec.md` y crea la rama `feat/NNN-nombre` en los repositorios afectados.
2. `claude --agent taquilla-orquestador` y se le pide ejecutar la spec.
3. El orquestador recorre el flujo: plan, aprobación, pruebas en rojo, código en verde, contrato, interfaz y revisión. Si la pantalla tiene interacción, se detiene antes de los controles para que el desarrollador ejecute la prueba de teclado.
4. El desarrollador revisa el diff, sube las ramas y abre un pull request por repositorio.
5. Con el CI en verde, el desarrollador fusiona en `main`. Si una spec se apoya en otra que aún no está fusionada, su rama sale de la rama de la anterior y los pull requests se fusionan en orden.

## Estado

Si cada spec ya llegó a `main` se ve en sus pull requests.

| Spec | Qué construye | Repositorios | Estado | Pull requests |
|---|---|---|---|---|
| [001 · Detalle de película](001-detalle-pelicula/spec.md) | Página de detalle y pruebas del frontend | frontend | Implementada y revisada | [Frontend #4](https://github.com/Bredman01/TaquilleraFrontend/pull/4) |
| [002 · Eventos y filtros de la cartelera](002-eventos-y-filtros/spec.md) | De películas a eventos, con categoría, ciudad y filtros | backend, frontend | Implementada y revisada | [Backend #5](https://github.com/Bredman01/Taquillera-Backend/pull/5) y [Frontend #5](https://github.com/Bredman01/TaquilleraFrontend/pull/5) |
| [003 · Funciones por evento](003-funciones-por-evento/spec.md) | Fechas, horas y precio en el detalle; filtro por fecha | backend, frontend | Implementada y revisada | [Backend #6](https://github.com/Bredman01/Taquillera-Backend/pull/6) y [Frontend #6](https://github.com/Bredman01/TaquilleraFrontend/pull/6) |
| [004 · Mapa de asientos](004-mapa-de-asientos/spec.md) | Selección de asientos de una función | backend, frontend | Implementada y revisada | [Backend #7](https://github.com/Bredman01/Taquillera-Backend/pull/7) y [Frontend #7](https://github.com/Bredman01/TaquilleraFrontend/pull/7) |
| [005 · Compra con pago simulado](005-compra-pago-simulado/spec.md) | Compra sin vender dos veces un asiento | backend, frontend | Implementada y revisada | [Backend #8](https://github.com/Bredman01/Taquillera-Backend/pull/8) y [Frontend #8](https://github.com/Bredman01/TaquilleraFrontend/pull/8) |
| [006 · Boleta con código QR y validación](006-boleta-por-codigo/spec.md) | Boleta con QR y validación del ingreso | backend, frontend | Implementada y revisada | [Backend #9](https://github.com/Bredman01/Taquillera-Backend/pull/9) y [Frontend #9](https://github.com/Bredman01/TaquilleraFrontend/pull/9) |
