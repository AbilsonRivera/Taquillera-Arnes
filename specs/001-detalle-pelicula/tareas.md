# Tareas · 001 Detalle de película

Una tarea se marca cuando su evidencia está en `evidencia/traza.md`.

- [x] T1 · desarrollador-front · habilitadora (CA-9): crear `vitest.config.ts` y `vitest.setup.ts`, comprobar con `npx vitest run --passWithNoTests`, `npm run lint` y `npm run build`, y hacer el commit `chore:` con `package.json` y `package-lock.json`. Evidencia: traza, paso 4, commit `5ac64e6`. (Primer intento bloqueado por el hook, paso 3; corregido por mí, paso 3b.)
- [x] T2 · probador-front · Red: pruebas de CA-1 a CA-7 y las cuatro de caracterización de `getPeliculas`, y commit `test:`. Evidencia: traza, pasos 5 y 5b, commits `aa8dad8` y `b645b14` (la segunda ronda añade cuatro pruebas de P8, P3 y D15).
- [x] T3 · desarrollador-front · Green: `getPelicula`, `DetallePelicula`, `PeliculaCard` como enlace y `/peliculas/[id]`; lint, `npm test`, `npm run test:cov` y build; commit `feat:`. Evidencia: traza, paso 6, commit `876cb79`.
- [x] T4 · guardian-contrato · comparar `GET /peliculas/:id` entre backend y frontend. Evidencia: traza, paso 7; informe completo en `evidencia/contrato.md` (veredicto: `coincide`).
- [x] T5 · verificador-ui · `inicio,peliculas/1,peliculas/9999` en 390 y 1280 px, tema claro y oscuro. Evidencia: traza, paso 8; informe en `evidencia/ui.md` y archivos del script en `evidencia/ui/` (resultado: pasa, con brechas de medición anotadas).
- [x] T6 · revisor · revisión completa, incluido `npm run test:cov` en el frontend y el orden `chore:` → `test:` → `feat:`. Evidencia: traza, paso 9; primera vuelta en `evidencia/revision.md` (veredicto: `aprobado`; 3 hallazgos medios y 3 bajos).
- [x] T6b · probador-front · refuerzo por decisión mía: pruebas de M1, M2 y M3 en un commit `test:` aparte, sin tocar producción. Evidencia: traza, paso 13, commit `54f9d7d`.
- [x] T6c · revisor · segunda vuelta, solo sobre `54f9d7d` y sobre M1, M2 y M3. Evidencia: traza, paso 14; informe a continuación del anterior en `evidencia/revision.md` (veredicto: `aprobado`; M1, M2 y M3 resueltos; B4 nuevo, bajo).
- [x] T7 · yo · actualizar `frontend/AGENTS.md`, revisar el diff, subir la rama y abrir el pull request. Hecho: actualicé `frontend/AGENTS.md` (`d8af73b`), subí la rama, abrí el pull request #4 en `Bredman01/TaquilleraFrontend` y se fusionó en `main` con el CI en verde (merge `7b090b0`). Evidencia: traza, pasos 11, 16 y 17.

## Hallazgos de la revisión y mis decisiones

El detalle de cada decisión, con su motivo, está en `evidencia/revision.md`.

- [x] M1 · corte a 5 s de `getPelicula` · **aceptado**; resuelto en `54f9d7d`, confirmado en la segunda vuelta
- [x] M2 · cuerpo primitivo en `getPelicula` · **aceptado**; resuelto en `54f9d7d`, confirmado
- [x] M3 · la tarjeta entera es el enlace · **aceptado**; resuelto en `54f9d7d`, confirmado
- [x] B1 · `plan.md` desactualizado · **aceptado**; corregido por el orquestador (matriz con las cuatro pruebas de `b645b14` y las tres de `54f9d7d`, comando de CA-9)
- [x] B2 · etiquetas de Género, Clasificación y Duración · **descartado**: CA-2 no las pide y se ven en las capturas del verificador-ui
- [x] B3 / O1 · aviso de Vite sobre `vitest.config.ts` · **descartado por ahora**: no falla nada, y renombrar obligaría a cambiar `rutas.json` y el plan; se revisa si Vite lo convierte en error
- [ ] B4 · la prueba de M3 no cubre la insignia de clasificación dentro del enlace · **aplazado a la spec 002 por decisión mía**
- [ ] Observaciones de diseño del verificador-ui (póster claro sobre fondo oscuro, página casi vacía en «no encontramos esa película», estado de error sin encabezado) · **para mi revisión en el pull request; no se tocan**
- [ ] Opcional · ampliar `herramientas/verificar-ui.mjs` para medir el nombre accesible y el `href` de las tarjetas, y axe con el backend apagado
