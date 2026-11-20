# Tareas · 003 Funciones por evento

Una tarea se marca cuando su evidencia está en `evidencia/traza.md`.

Tareas del plan aprobado el 19 de noviembre de 2026. Las mías (T0 y T10) detienen al orquestador hasta que las ejecuto.

## Preparación

- [x] T0 · yo · habilitadora: creé las ramas `feat/003-funciones-por-evento` en backend y en frontend desde la punta de 002, y agregué a la guía visual las filas «Campo de fecha» y «Subtítulo (`h3`)» y el `min-h-11` de los campos (traza, pasos 2 y 3)

## Backend

- [x] T1 · probador-back · Red: línea base de mutación de `src/eventos` (98,82 %); 24 unitarias y 12 e2e nuevas; zona forzada de D5 funcionando; commit `73c9a20` `test:` (traza, paso 4)
- [x] T2 · desarrollador-back · Green: módulo `funciones`, ruta `GET /eventos/:id/funciones`, filtro `?fecha=`; lint, 47 unitarias, 26 e2e, cobertura 92,85 %, build, `curl` y Grep de D17; commit `6017bd6` `feat:` (traza, paso 5)

## Frontend

- [x] T3 · probador-front · Red del detalle: 24 pruebas nuevas en 4 archivos (CA-1 y CA-6 a CA-10); zona forzada de D5 funcionando; salida real de `Intl`; commit `6b38597` `test:` (traza, paso 6)
- [x] T4 · desarrollador-front · Green del detalle: `formato.ts`, `funciones.ts`, `FuncionesEvento.tsx`, `DetalleEvento.tsx` y `eventos/[id]/page.tsx`; lint, 81 pruebas, cobertura 99,31 %, build sin avisos, `curl` y Grep de D17; commit `8b738d5` `feat:` (traza, paso 7)
- [x] T5 · probador-front · Red del filtro: 10 pruebas nuevas en 4 archivos (CA-11), el cambio de `FiltrosCartelera.test.tsx:126` y el `import` estático de `FuncionesEvento` en `DetalleEvento.test.tsx`; commit `a75ef62` `test:` (traza, paso 8)
- [x] T6 · desarrollador-front · Green del filtro: `eventos.ts`, `cartelera.ts`, `FiltrosCartelera.tsx` y `VistaCartelera.tsx`, con `min-h-11` en los desplegables y en «Fecha» (M1 de 002, D22); lint, 91 pruebas, cobertura 99,38 %, build sin avisos, `curl` y Grep de D17; commit `3f7cdea` `feat:` (traza, paso 9)

## Controles

- [x] T7 · guardian-contrato · la regla de fecha válida **coincide** en los dos repositorios (22 entradas evaluadas, ninguna difiere); una diferencia: el plan se contradecía (tabla «Contrato» decía enteros, D9 decía «numéricos»); resuelta con B-1 (traza, paso 12; `evidencia/contrato.md`)
- [x] T8 · verificador-ui · **primera vuelta:** `pasa` en las ocho rutas, 32 visitas sin violaciones de axe, errores de consola ni desbordes, ningún control bajo 44 px (traza, paso 13). **Segunda vuelta** (solo `inicio` y `?fecha=2026-11-21`, tras B-8): `pasa`, los cuatro controles de la fila de filtros miden 48 px (traza, paso 24). **Tercera vuelta** (las ocho rutas sobre el código final, repetida por mí): `pasa`, sin bloqueos ni observaciones, 48 px en los cuatro controles, y `evidencia/ui/` vuelve a tener las 40 capturas (traza, paso 27). Evidencia en `evidencia/ui.md` (las tres vueltas) y `evidencia/ui/` (la tercera)
- [x] T9 · revisor · **primera vuelta:** `aprobado con observaciones`, 3 medios y 8 bajos; mutación de `src/eventos` 96,69 % frente a 98,82 % (traza, paso 14). **Segunda vuelta:** `aprobado con observaciones`, M-1, M-2, B-5 y B-8 resueltos y un bajo nuevo (B-9, resuelto en el cierre); mutación de `src/eventos` 97,11 % (99,16 % sin los 5 equivalentes) y de `src/funciones` 100 % (traza, paso 25; `evidencia/revision.md`)

## Ronda de refuerzo tras la primera revisión (mi decisión, traza, paso 16)

- [x] R1 · desarrollador-back · M-2: comprobación temporal sin commit. Sin `timeZone`, 47 y 26 pruebas en verde: confirmado (traza, paso 18)
- [x] R2 · desarrollador-front · M-2: comprobación temporal sin commit, en cada uno de los tres formateadores. Las 91 pruebas en verde: confirmado (traza, paso 19)
- [x] R3 · probador-back · M-1 y M-2: fechas bisiestas y zona con `vi.hoisted`; commit `983f18a` `test:` (traza, paso 20)
- [x] R4 · probador-front · M-1 y M-2: fechas bisiestas y zona con `vi.hoisted`; commit `0178e84` `test:` (traza, paso 21)
- [x] R5 · desarrollador-back · M-2: repetición de la comprobación; ahora fallan 4 unitarias y 3 e2e (traza, paso 22)
- [x] R6 · desarrollador-front · M-2: repetición (ahora fallan 3, 5 y 4 pruebas); B-5, commit `e2e1777` `refactor:`; B-8, commit `4559836` `fix:` (traza, paso 23)
- [x] R7 · verificador-ui · T8, segunda vuelta: 48 px en los cuatro controles (traza, paso 24)
- [x] R8 · revisor · T9, segunda vuelta con la mutación de `src/eventos` (traza, paso 25)
- [x] M-3 · yo · comprobado con una prueba automática de teclado en Chrome (`herramientas/recorridos/003-fecha.mjs`, `evidencia/interaccion.md`): el icono del calendario sí muestra su anillo; falso negativo de la medición
- [x] B-1 y B-2 · yo · decidí que manda el comportamiento actual; orquestador: tabla «Contrato» y D9 corregidas en `plan.md`
- [x] B-4, B-6 y B-7 · yo · B-4 a «Desviaciones»; B-6 y B-7 se quedan; orquestador: `plan.md`, «Desviaciones»
- [x] `plan.md` · orquestador · citas, contrato, D5, D9, D10, D13, D22, D23 nueva y «Desviaciones» completa (traza, paso 26)

## Decisiones de cierre (mías, traza, paso 27)

- [x] B-9 · yo · acepté las capturas perdidas y lo resolví: cambié `herramientas/verificar-ui.mjs` para que no vacíe `evidencia/ui/` (solo reemplaza las capturas de las direcciones que vuelve a visitar) y repetí la verificación con las ocho rutas sobre el código final: «Resultado: pasa», sin bloqueos ni observaciones, y la carpeta vuelve a tener las 40 capturas, con el `informe.md` y el `informe.json` de esa tercera pasada
- [x] Guía visual · yo · ya tiene la regla de que, en una fila de formulario, los campos, las listas y el botón llevan `h-12` (`SKILL.md:57`)
- [x] Clase con caracteres invisibles de `formato.test.ts` · yo · la dejo como está
- [x] Permisos de los agentes (`rm` y `cp` del probador-back) · yo · tenía razón y era un hueco real; lo corregí: el arnés se ejecuta en el modo normal de permisos, con `Edit` y `Write` permitidos dentro de las rutas y con `rm`, `mv`, `cp`, `sed -i`, `tee`, `git rm` y `git mv` negados para todos; lo comprobé con sesiones reales; quedó en la bitácora (entrada 42) y en el README

## Cierre

- [x] T10 · yo · hecha (traza, paso 27):
  - **Backend:** corrí Prettier (commit `9e1a719` `style:`, solo formato en `main.ts` y en dos archivos de prueba; lint, 47 unitarias y 26 e2e siguen en verde) y actualicé el README y `AGENTS.md` (commit `4f3815e` `docs:`) con la ruta de funciones, el filtro por fecha y la regla de la hora de Colombia. Subí la rama y abrí el pull request #6 en Bredman01/Taquillera-Backend, con el CI en verde.
  - **Frontend:** actualicé el README y `AGENTS.md` (commit `b88075b` `docs:`). Subí la rama y abrí el pull request #6 en Bredman01/TaquilleraFrontend, con el CI en verde.
  - Los pull requests van sobre las ramas de la spec 002 y se fusionan primero el del backend.
