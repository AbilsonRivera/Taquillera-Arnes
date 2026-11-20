# Tareas · 006 Boleta con código QR y validación

Una tarea se marca cuando su evidencia está en `evidencia/traza.md`.

- [x] T0 · yo · las ramas `feat/006-boleta-por-codigo`, la dependencia `qrcode-generator` 2.0.4 (`d76c2fd`), la guía visual 1.4.0 (`6fa4f09`) y `jsqr` en `herramientas/` (`a953698`)
- [x] T1 · probador-back · rojo 1: línea base de mutación sobre `src/compras` y pruebas de `ComprasService.findByCodigo` (`test:`) · `706ed80`
- [x] T2 · desarrollador-back · verde 1: `findByCodigo` y los `exports` de `ComprasModule` (`feat:`) · `4a22f17`
- [x] T3 · probador-back · rojo 2: pruebas del servicio, del controlador y e2e del módulo `boletas` (`test:`) · `f5dc751`
- [x] T4 · desarrollador-back · verde 2: módulo `boletas` (GET de la boleta y POST del ingreso), registro en `app.module.ts` y prueba con `curl` (`feat:`) · `abaa0c3`
- [x] T4b · yo · formato de Prettier en el tipo de la boleta del backend (`style:`, un archivo, sin cambio de comportamiento) · `63c4373`
- [x] T5 · yo · tres piezas nuevas en la guía visual (versión 1.5.0, `SKILL.md:47-49`): «Código QR», «Estado de la boleta» y «Formulario del encabezado»
- [x] T6 · probador-front · rojo 3: pruebas de `lib/boletas.ts`, `lib/ingreso.ts` y `lib/qr.ts` (`test:`) · `4caceea`
- [x] T6b · probador-front · (agregada por el orquestador al ver el informe de T6; la acepté yo después de aprobar el plan) dos pruebas más: `getBoleta` devuelve `error` si `inicio` o `fechaUso` no son fechas que `Date.parse` entienda, como `getFuncion` (`funciones.ts:63-74`) y `comprar` (`compras.ts:159-174`); y `origenDeLaPeticion` usa solo el primer valor de `x-forwarded-host` (`test:`) · `eb9fd7f`
- [x] T7 · desarrollador-front · verde 3: `lib/boletas.ts`, `lib/ingreso.ts` y `lib/qr.ts` (`feat:`) · `09958dc`
- [x] T8 · probador-front · rojo 4: pruebas de `CodigoQr`, `IngresoBoleta` y `VistaBoleta` (`test:`) · `f4bdb18`
- [x] T9 · desarrollador-front · verde 4: `CodigoQr`, `IngresoBoleta`, `VistaBoleta` y la página `/boletas/[codigo]` (`feat:`) · `8de9ec8`
- [x] T10 · probador-front · rojo 5: pruebas de `ConsultarBoleta` y del enlace «Ver mi boleta» en `FormularioCompra` (`test:`) · `a7d73f1`
- [x] T11 · desarrollador-front · verde 5: `ConsultarBoleta`, el encabezado de `layout.tsx` y «Ver mi boleta» (`feat:`) · `93a6a58`
- [x] T12 · desarrollador-front · el borde de los campos pasa a `zinc-500` en los filtros y en la compra (`fix:`) · `090fc66`
- [x] T13 · yo · prueba de recorrido `006-boleta.mjs` (50 de 50) y los ajustes de 003, 004 y 005 por el encabezado nuevo (005: 50 de 50, 004: 37 de 37, 003: 12 de 12, 002: 14 de 14); salida en `evidencia/interaccion.md`
- [x] T14 · guardian-contrato · compara el frontend con las dos rutas de la API: `coincide`, con seis observaciones; informe en `evidencia/contrato.md`
- [x] T15 · verificador-ui · tres rutas: `pasa`, sin axe, consola ni desborde; ningún hallazgo bloquea, seis señalamientos; informe en `evidencia/ui.md` y salida del script en `evidencia/ui/`
- [x] T16 · revisor · primera vuelta: `aprobado`, sin críticos ni altos, tres medios y cinco bajos; informe en `evidencia/revision.md`
- [x] T16a · yo · ronda de correcciones, la parte mía: el axe a 390 px en tema claro con la boleta con datos en `006-boleta.mjs` (M1; ahora 52 de 52), dos capturas nuevas de los estados de error y la guía visual 1.5.1 con `inline-block` en «Usada» (B5; commit `268ef56` del arnés); mis decisiones están en `evidencia/revision.md`
- [x] T16b · probador-front · rojo 6: cinco pruebas del tope del host (M2) y el `h2` «Ingreso» (B4) en tres archivos de prueba (`test:`); 7 en rojo de 225 · `616b150`
- [x] T16c · desarrollador-front · verde 6: el tope de 253 caracteres del host en `lib/boletas.ts` (M2), el `h2` «Ingreso» y `inline-block` en `ESTADO_USADA` en `IngresoBoleta.tsx` (B4 y B5) (`fix:`); 225 de 225, cobertura 99,8 % · `7e0b47c`
- [x] T16d · revisor · segunda vuelta, solo los commits nuevos y M1, M2, B4 y B5, sin mutación: `aprobado`, los cuatro hallazgos resueltos y ninguno se repite, tres bajos nuevos (N1 a N3, sin decidir); informe en `evidencia/revision.md`
- [x] T17 · yo · repetí las pruebas de navegador de las cinco specs sobre el código final (52 comprobaciones en la de la boleta), repetí el lint y las pruebas de los dos lados (115 y 54 en el backend, 225 en el frontend), actualicé el README y `AGENTS.md` de los dos repositorios con commits `docs:` (la nota de cuándo va cada formulario y el límite de validar desde otro dispositivo), subí las ramas y abrí los pull requests #9 de `Taquillera-Backend` y de `TaquilleraFrontend`
