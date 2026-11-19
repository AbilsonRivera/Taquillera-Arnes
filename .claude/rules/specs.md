---
paths:
  - "specs/**"
---

# Archivos de una spec

- Cada spec vive en `specs/NNN-nombre/` con tres archivos: `spec.md` (qué y por qué), `plan.md` (cómo) y `tareas.md` (pasos), más la carpeta `evidencia/`.
- `spec.md` no nombra archivos, clases ni librerías. Sus criterios de aceptación llevan identificador (`CA-1`, `CA-2`...) y cada uno se puede comprobar con una prueba o en la pantalla.
- `plan.md` sigue `specs/_plantilla/plan.md`. Su matriz tiene una fila por cada criterio de `spec.md`.
- `tareas.md` usa casillas `- [ ]` y `- [x]`. Una tarea se marca solo cuando su evidencia está en `evidencia/traza.md`.
- `evidencia/` guarda lo que produjeron los controles, sin editarlo: `traza.md`, `contrato.md`, `revision.md` y `ui/`.
- Si lo implementado se aparta de la spec o del plan, se corrige el documento en la misma rama y se anota el motivo en la sección «Desviaciones» de `plan.md`.
