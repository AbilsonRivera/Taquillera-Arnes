# Tareas · 001 Detalle de película

Una tarea se marca cuando su evidencia está en `evidencia/traza.md`.

- [x] T1 · desarrollador-front · habilitadora (CA-9): crear `vitest.config.ts` y `vitest.setup.ts`, comprobar con `npx vitest run --passWithNoTests`, `npm run lint` y `npm run build`, y hacer el commit `chore:` con `package.json` y `package-lock.json`. Evidencia: traza, paso 4, commit `5ac64e6`. (Primer intento bloqueado por el hook, paso 3; corregido por el desarrollador humano, paso 3b.)
- [x] T2 · probador-front · Red: pruebas de CA-1 a CA-7 y las cuatro de caracterización de `getPeliculas`, y commit `test:`. Evidencia: traza, pasos 5 y 5b, commits `aa8dad8` y `b645b14` (la segunda ronda añade cuatro pruebas de P8, P3 y D15).
- [x] T3 · desarrollador-front · Green: `getPelicula`, `DetallePelicula`, `PeliculaCard` como enlace y `/peliculas/[id]`; lint, `npm test`, `npm run test:cov` y build; commit `feat:`. Evidencia: traza, paso 6, commit `876cb79`.
- [x] T4 · guardian-contrato · comparar `GET /peliculas/:id` entre backend y frontend. Evidencia: traza, paso 7; informe completo en `evidencia/contrato.md` (veredicto: `coincide`).
- [x] T5 · verificador-ui · `inicio,peliculas/1,peliculas/9999` en 390 y 1280 px, tema claro y oscuro. Evidencia: traza, paso 8; informe en `evidencia/ui.md` y archivos del script en `evidencia/ui/` (resultado: pasa, con brechas de medición anotadas).
- [x] T6 · revisor · revisión completa, incluido `npm run test:cov` en el frontend y el orden `chore:` → `test:` → `feat:`. Evidencia: traza, paso 9; informe completo en `evidencia/revision.md` (veredicto: `aprobado`; 3 hallazgos medios y 3 bajos abiertos, ninguno bloquea).
- [ ] T7 · desarrollador humano · actualizar `frontend/AGENTS.md` en la misma rama, revisar el diff, subir la rama y abrir el pull request

## Abiertos para el desarrollador humano (no bloquean)

- [ ] M1 · probador-front · prueba del corte a 5 s de `getPelicula` (`peliculas.ts:80`)
- [ ] M2 · probador-front · prueba de un 200 con cuerpo primitivo (`peliculas.ts:90`)
- [ ] M3 · probador-front · prueba de que la tarjeta entera es el enlace (`PeliculaCard.test.tsx`)
- [ ] B2 · probador-front · relacionar Género, Clasificación y Duración con su etiqueta (`DetallePelicula.test.tsx`)
- [ ] O1 · desarrollador humano · aviso de Vite sobre `vitest.config.ts` (`"type": "module"`, `.mts` o variable de entorno)
- [ ] Ampliar `herramientas/verificar-ui.mjs` para medir el nombre accesible y el `href` de las tarjetas, y axe con el backend apagado (opcional)
