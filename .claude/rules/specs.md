---
paths:
  - "specs/**"
---

# Archivos de una spec

- Cada spec vive en `specs/NNN-nombre/` con tres archivos: `spec.md` (qué y por qué), `plan.md` (cómo) y `tareas.md` (pasos), más la carpeta `evidencia/`.
- `spec.md` no nombra archivos, clases ni librerías. Sus criterios de aceptación llevan identificador (`CA-1`, `CA-2`...) y cada uno se puede comprobar con una prueba o en la pantalla.
- `plan.md` sigue `specs/_plantilla/plan.md`. Su matriz tiene una fila por cada criterio de `spec.md`.
- `tareas.md` usa casillas `- [ ]` y `- [x]`. Una tarea se marca solo cuando su evidencia está en `evidencia/traza.md`.
- `evidencia/` guarda lo que produjeron los controles, sin editarlo: `traza.md`, `contrato.md`, `revision.md`, `ui.md` con la carpeta `ui/`, e `interaccion.md` con sus capturas cuando la pantalla tiene interacción.
- Si lo implementado se aparta de la spec o del plan, se corrige el documento en la misma rama y se anota el motivo en la sección «Desviaciones» de `plan.md`.
- Lo que decide o hace el desarrollador se anota en primera persona y con sus palabras («aprobé el plan», «descarté B2 porque…», «instalé las dependencias»), nunca como «el desarrollador humano decidió». Los agentes se nombran por su rol. No se anota que el desarrollador revisó o comprobó algo si él no lo dijo.
