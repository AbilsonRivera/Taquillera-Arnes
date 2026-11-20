# Tareas · 002 Eventos y filtros de la cartelera

Una tarea se marca cuando su evidencia está en `evidencia/traza.md`.

Tareas del plan aprobado el 19 de noviembre de 2026. Las mías (T2, T5 y T10) detienen al orquestador hasta que las ejecuto.

## Backend

- [x] T1 · probador-back · Red: línea base de mutación de `src/peliculas` (61,29 %), 22 unitarias y 13 e2e nuevas, commit `0ab6947` `test:` (traza, pasos 3 y 4)
- [x] T2 · yo · habilitadora: `git -C backend rm -r src/peliculas test/peliculas.e2e-spec.ts` (sin commit; traza, paso 4)
- [x] T3 · desarrollador-back · Green: módulo `eventos`, `app.module.ts`, lint, pruebas, e2e, cobertura 91,3 %, build, `curl` y Grep de D17; commit `de4fb6b` `feat:` (traza, paso 5)

## Frontend

- [x] T4 · probador-front · Red: 52 pruebas en 9 archivos (CA-3, CA-5 y CA-7 a CA-14; la de la tarjeta comprueba con `within` que la insignia de clasificación queda dentro del enlace: B4 de 001); commit `c321042` `test:` (traza, paso 6)
- [x] T4b · probador-front · Red: dos pruebas de la ciudad repetida en la dirección; commit `561f74c` `test:` (traza, paso 7). Confirmada por mí con la respuesta a P5
- [x] T5 · yo · habilitadora: `git -C frontend rm -r` de los archivos de películas (sin commit; traza, paso 9). La parte del arnés (guía visual, `nombreDe` y el recorrido con Tab de `verificar-ui.mjs`) también la hice
- [x] T6 · desarrollador-front · Green: `lib/eventos.ts`, `lib/cartelera.ts`, cuatro componentes, `Cartelera.tsx`, `page.tsx`, `eventos/[id]/page.tsx` y `layout.tsx`; lint, 55 pruebas, cobertura 98,94 %, build sin avisos, `curl` y Grep de D17; commit `3dcf6e0` `feat:` (traza, paso 10)
- [x] T6b · probador-front · Red: el estado de error de `/eventos/{id}` tiene un `h1` «No pudimos cargar el evento» encima del aviso con `role="alert"`; en los tres estados hay un solo `h1`; commit `cacf501` `test:` (traza, paso 13; decisión mía sobre el `h1`, paso 12)
- [x] T6c · desarrollador-front · Green: `DetalleEvento` en el estado de error con ese `h1` y el aviso con el texto exacto de CA-12 debajo; 57 pruebas; commit `4cc49e5` `fix:` (traza, paso 14)

## Controles

- [x] T7 · guardian-contrato · `coincide`; dos aclaraciones de borde que son del plan (traza, paso 16; `evidencia/contrato.md`)
- [x] T8 · verificador-ui · `pasa` en las seis rutas, 24 visitas sin violaciones de axe, errores de consola ni desbordes; recorrido con Tab con los dos filtros y «Filtrar» con su nombre (traza, paso 17; `evidencia/ui.md` y `evidencia/ui/`). Lo que el script no cubría, pulsar «Filtrar», lo comprobé yo con una prueba automática en Chrome (`evidencia/interaccion.md`, traza, paso 20)
- [x] T9 · revisor · `aprobado`, primera vuelta: sin críticos ni altos, 2 medios y 5 bajos; mutación de `src/eventos` 98,82 % frente a 61,29 % (traza, paso 18; `evidencia/revision.md`)

## Mis decisiones sobre los hallazgos de T9 (traza, paso 20; `evidencia/revision.md`)

- [x] M1 · desplegables de ~41 px frente a los 44 px de la guía: **aplazada a la spec 003** (P9). La 003 modifica ese mismo formulario; la guía visual ya tiene `min-h-11` y el script de verificación ahora avisa si un control mide menos de 44 px
- [x] M2 · pulsar «Filtrar» en un navegador: **resuelta** (P8), con `herramientas/recorridos/002-filtros.mjs` y `evidencia/interaccion.md`: 14 pasos, todos pasan
- [x] B1 · traza y `tareas.md` sin T6b a T8: corregido por el orquestador (traza, pasos 12 a 19)
- [x] B2 · documentar en «Contrato» la precedencia del 400 y la ciudad de solo espacios: la precedencia y el comportamiento actual ya están en el plan; **descarto cambiar la ciudad de solo espacios** (P7)
- [x] R10 · `aria-label` de la insignia: **descartado** (P10), decisión de la spec 001
- [x] B3 · `frontend/AGENTS.md` con películas: **hecho** (`9c7de2a`)
- [x] B4 · `backend/README.md` con «PENDIENTE»: **hecho** (`8724e3b`)
- [x] B5 · variable `p` en la skill `nest-modulo`: **hecho** (`8724e3b`)

## Cierre

- [x] T10 · yo · `AGENTS.md` de los dos repositorios, revisar los diffs, subir las ramas y abrir los pull requests. **Hecha.**
  - **Frontend:** commit `docs:` `9c7de2a` con el README nuevo (ya no es la plantilla de create-next-app: explica el arnés) y `AGENTS.md` actualizado a eventos. Subí la rama y abrí el pull request #5 en Bredman01/TaquilleraFrontend.
  - **Backend:** commit `docs:` `8724e3b` con el enlace al pull request en el README y el ejemplo de la skill `nest-modulo` corregido. El pull request es el #5 de Bredman01/Taquillera-Backend, con el CI en verde (antes: `bf2694b`).
  - **Orden de fusión:** primero el pull request del backend y después el del frontend.
  - El orquestador leyó los reflogs de los dos repositorios (`8724e3b` y `9c7de2a`); no puede ver las ramas subidas, los pull requests ni el CI.
