# Tareas · 005 Compra con pago simulado

Una tarea se marca cuando su evidencia está en `evidencia/traza.md`.

Tareas del plan aprobado el 20 de noviembre de 2026. Las mías (T0, T5, T12 y T14) detienen al orquestador hasta que las ejecuto. Se delega una sola tarea a la vez.

## Preparación

- [x] T0 · yo · habilitadora: creé las ramas `feat/005-compra-pago-simulado` en backend y en frontend, desde la punta de `feat/004-mapa-de-asientos`; el orquestador las comprobó (traza, paso 3)
- [x] T5 · yo · guía visual: copié a la guía la fila «Lista de datos» (versión 1.3.0); el orquestador la leyó en `SKILL.md:46` (traza, paso 3)

## Backend

- [x] T1 · probador-back · Rojo 1: línea base de mutación de `src/asientos` y `hora-colombia.ts` (100 %, 35 mutantes matados, 5 «errores» heredados de 004); 15 pruebas nuevas en `asientos.service.spec.ts` y 2 en `hora-colombia.spec.ts` (CA-2 a CA-5, B2 y `fechaHoraEnColombia`); 16 en rojo y las viejas en verde; commit `683c1df` `test:` (traza, pasos 4a y 4)
- [x] T2 · desarrollador-back · Verde 1: `ocupar`, `existeEnElPlano`, `exports` de `AsientosModule` y `fechaHoraEnColombia`; commit `3b5ed69` `feat:`; la sesión se cortó después de este commit y las comprobaciones se repitieron sobre él sin tocar el código: lint, 78 pruebas, 35 e2e, cobertura 93,79 %, build y Grep de D21 (2, 7, 8, 9, 11 y 12), todo en verde y sin `fix:` (traza, pasos 5, 6 y 7)
- [x] T3 · probador-back · Rojo 2: 5 archivos nuevos y 32 pruebas (`compras.service.spec.ts` 18, controlador 2, generador 1, reloj 1 y e2e 10; CA-1 a CA-5) en rojo por «Cannot find module» y las 78 + 35 de antes en verde; T3b: dos casos que fijan qué asiento nombra la regla 4 (aclaración mía), con `--amend`; commit `d680ff1` `test:` (traza, pasos 8 y 8b)
- [x] T4 · desarrollador-back · Verde 2: módulo `compras` (`GeneradorCodigo`, `Reloj`, `ComprasService`, `ComprasController`, `ComprasModule`) y su registro; lint, 100 pruebas, 45 e2e, cobertura 94,94 % (`src/compras` 97,1 %), build, `curl` (201, 409, mapa, 404, 400 y consulta previa de CORS en 204) y Grep de D21 del backend; commit `35ebbb1` `feat:` (traza, paso 9)

## Frontend

- [x] T6 · probador-front · Rojo 3: `lib/compras.test.ts` con 15 pruebas (CA-1, CA-6, CA-7 y CA-9 a CA-12, y las sin criterio de lib) en rojo por el import de `@/lib/compras` y las 137 de antes en verde; commit `5dd0fef` `test:` (traza, paso 10)
- [x] T7 · desarrollador-front · Verde 3: `lib/api.ts`, `lib/compras.ts` y los imports de `eventos.ts` y `funciones.ts`; lint, 152 pruebas, cobertura 99,68 % (`compras.ts` 100 %), build sin avisos y Grep de D21 (1, 5, 6, 8 y 13); commit `c7aca82` `feat:` (traza, paso 11)
- [x] T8 · probador-front · Rojo 4: `CompraFuncion.test.tsx` (7) y `FormularioCompra.test.tsx` (16; CA-6 a CA-12), solo con `fireEvent`, con la zona forzada con `vi.hoisted` en el primero; en rojo por el import de los componentes y las 152 de antes en verde; commit `f380d8e` `test:` (traza, paso 12)
- [x] T9 · desarrollador-front · Verde 4: `CompraFuncion.tsx`, `FormularioCompra.tsx` (el único componente de cliente nuevo), `app/funciones/[id]/compra/page.tsx` y sin `prefetch={false}` en `MapaAsientos.tsx`; lint, 175 pruebas, cobertura 99,73 %, build sin avisos ni «blocking-route» y con la ruta `/funciones/[id]/compra`, `curl` de las cuatro páginas (solo `GET`) y Grep de D21 del frontend; commit `5e4df84` `feat:` (traza, paso 13)

## Prueba de recorrido

- [x] T12 · yo · escribí `herramientas/recorridos/005-compra.mjs` con los 17 pasos del plan y lo ejecuté con los dos servidores de producción recién iniciados: 50 comprobaciones, todas pasan; cambié la comprobación 22 de `004-mapa.mjs` («La precarga de "Continuar" no falla») y repetí ese recorrido con el backend recién iniciado: 37 comprobaciones, todas pasan; salidas en `evidencia/interaccion.md` y capturas a 390 px en `evidencia/interaccion/`; R3, R4, R5 y R8 resueltos; el orquestador la comprobó en el disco (traza, pasos 15 y 15b)

## Controles

- [x] T10 · guardian-contrato · «coincide» (backend `35ebbb1`, frontend `5e4df84`): ruta, petición, 201, 409, las ocho reglas, códigos de estado, tipos, textos y pruebas; ninguna diferencia que bloquee y cinco informativas (I1 a I5); evidencia en `evidencia/contrato.md` (traza, paso 16)
- [x] T11 · verificador-ui · «pasa»: cuatro rutas de D22 en 16 visitas (390 y 1280 px, claro y oscuro) con 0 violaciones de axe, 0 errores de consola, 0 peticiones fallidas y sin desborde; recorrido con Tab de 4, 2, 2 y 1 paradas, todas con nombre, foco visible y 44 px o más; las cuatro rutas con `role="alert"` sin backend; sin peticiones canceladas por el router de Next; seis observaciones que no bloquean (H1 a H6); evidencia en `evidencia/ui/` y `evidencia/ui.md` (traza, paso 17)
- [x] T13 · revisor · «aprueba con observaciones»: 0 críticos, 0 altos, 1 medio (M1: el backend no prueba un correo válido seguido de texto) y 7 bajos (B1 a B7); mutación de `src/asientos`, `src/compras` y `hora-colombia.ts` 99,03 % (206 mutantes, 2 sobreviven: uno equivalente y M1) frente a la línea base de T1 (100 %); D21 conforme; orden de commits y mensajes correctos; B2 de 004 cerrado; evidencia en `evidencia/revision.md` (traza, paso 18)

## Correcciones de la revisión

Las decidí al cerrar; mis decisiones están al final de `evidencia/revision.md`.

- [x] T13a · probador-back · M1: dos casos a la regla 8 de `CASOS_DE_400` (`compras.service.spec.ts:377-386`), con un commit `test:` aparte y sin tocar el código; `npm test` en 11 archivos y 100 pruebas; mutación medida otra vez: 99,51 % (206 mutantes, 190 matados, 15 timeouts, 1 sobrevive —el equivalente—) y el mutante de la expresión sin `$` muere; commit `f6e9e8c` `test:` (traza, paso 21)
- [x] T13b · desarrollador-back · B3: el comentario de `ocupar` dice ahora lo que valida quien lo llama; solo comentario (`asientos.service.ts:66-76`); lint, 100 pruebas, 45 e2e, cobertura 94,94 % y build con las mismas cifras; commit `8fcc622` `docs:` (traza, paso 22)
- [x] T13c · desarrollador-front · B1: quita `sm:w-auto` de `BOTON_PAGAR` (`FormularioCompra.tsx:59`); lint, 175 pruebas, cobertura 99,73 % y build con las mismas cifras; no se repite el verificador-ui; commit `24f2c48` `fix:` (traza, paso 23)

## Cierre

- [x] orquestador · escribí `plan.md` una sola vez con mis decisiones: matriz con las 23 pruebas extra y «Pruebas sin criterio» con las 13 restantes (B2), D18 corregido (B1), «Desviaciones» completa con mis dos puntos de T12 (B7), la interrupción, la regla 4, M1, B3 y lo descartado o aplazado, y «Riesgos» con R1 y R3 a R9 resueltos (traza, pasos 20 y 24)
- [x] mis decisiones sobre M1 y B1 a B7 (y H4 y H5), al final de `evidencia/revision.md`, en «Mis decisiones sobre los hallazgos»
- [x] T14 · yo · repetí el lint y las pruebas de los dos lados sobre las puntas finales (100 y 45 en el backend, 175 en el frontend), actualicé el README y `AGENTS.md` de los dos repositorios con commits `docs:`, subí las ramas y abrí los pull requests #8 de `Taquillera-Backend` y de `TaquilleraFrontend` (traza, paso 25)
