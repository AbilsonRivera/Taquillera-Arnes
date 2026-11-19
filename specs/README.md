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
    revision.md  Informe del revisor, con la mutación del backend
    ui/          Capturas, axe y consola del verificador-ui
```

| Documento | Quién lo escribe | Cuándo |
|---|---|---|
| `spec.md` | El desarrollador, con la skill `nueva-spec` | Antes de empezar |
| `plan.md` | El `planificador` lo redacta y el orquestador lo guarda | Antes de cualquier código; lo aprueba el desarrollador |
| `tareas.md` | El orquestador | Al aprobarse el plan; se marca en cada paso |
| `evidencia/` | El orquestador, con los informes de los controles | Durante el flujo |

## Ciclo de vida

1. El desarrollador escribe `spec.md` y crea la rama `feat/NNN-nombre` en los repositorios afectados.
2. `claude --agent taquilla-orquestador` y se le pide ejecutar la spec.
3. El orquestador recorre el flujo: plan, aprobación, pruebas en rojo, código en verde, contrato, interfaz y revisión.
4. El desarrollador revisa el diff, sube las ramas y abre un pull request por repositorio.
5. Con el CI en verde, el desarrollador fusiona en `main` y actualiza la tabla de abajo.

## Estado

| Spec | Qué construye | Repositorios | Estado | Pull requests |
|---|---|---|---|---|
| [001 · Detalle de película](001-detalle-pelicula/spec.md) | Página de detalle y pruebas del frontend | frontend | Implementada y revisada; en pull request | [Frontend #4](https://github.com/Bredman01/TaquilleraFrontend/pull/4) |
| [002 · Funciones por película](002-funciones-por-pelicula/spec.md) | Horarios, sala y precio en el detalle | backend, frontend | Aprobada, sin empezar | Pendientes |
| [003 · Mapa de asientos](003-mapa-de-asientos/spec.md) | Selección de asientos de una función | backend, frontend | Aprobada, sin empezar | Pendientes |
| [004 · Compra con pago simulado](004-compra-pago-simulado/spec.md) | Compra sin vender dos veces un asiento | backend, frontend | Aprobada, sin empezar | Pendientes |
| [005 · Boleta por código](005-boleta-por-codigo/spec.md) | Consulta y validación de la boleta | backend, frontend | Aprobada, sin empezar | Pendientes |
