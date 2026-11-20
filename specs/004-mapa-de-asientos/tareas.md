# Tareas · 004 Mapa de asientos

Una tarea se marca cuando su evidencia está en `evidencia/traza.md`.

Tareas del plan aprobado el 19 de noviembre de 2026. Las mías (T0, T3, T11 y T12) detienen al orquestador hasta que las ejecuto.

## Preparación

- [x] T0 · yo · habilitadora: creé las ramas `feat/004-mapa-de-asientos` en backend y en frontend, desde la punta de `feat/003-funciones-por-evento` (que ya incluye la ronda de refuerzo de 003); el orquestador las comprobó (traza, paso 3)
- [x] T3 · yo · guía visual: copié a la guía las cinco filas nuevas del mapa (asiento disponible, seleccionado, ocupado, fila de asientos y «Escenario o pantalla»); el orquestador las leyó en `SKILL.md:46-50` (traza, paso 3)

## Backend

- [x] T1 · probador-back · Red: línea base de mutación de `src/funciones` (100 %); 14 unitarias y 9 e2e nuevas (CA-1 y CA-2); commit `28432b1` `test:` (traza, paso 4)
- [x] T2 · desarrollador-back · Green: módulo `asientos`, `findOne` en `funciones`, rutas y datos de ejemplo; lint, 61 unitarias, 35 e2e, cobertura 92,85 %, build, `curl` y Grep de D23; commit `df90c94` `feat:` (traza, paso 5)

## Frontend

- [x] T4 · probador-front · Red de la cabecera: 22 pruebas nuevas (`getFuncion`, `getAsientos` y `DetalleFuncion`; CA-1 a CA-3 y CA-10), con la zona forzada con `vi.hoisted`; commit `26e82e4` `test:` (traza, paso 6)
- [x] T5 · desarrollador-front · Green de la cabecera: `lib/eventos.ts` (exporta `ID_VALIDO`), `lib/funciones.ts` y `DetalleFuncion.tsx`; lint, 113 pruebas, cobertura 99,5 %, build sin avisos y Grep de D23; commit `f188a83` `feat:` (traza, paso 7)
- [x] T6 · probador-front · Red del mapa: 23 pruebas nuevas en 3 archivos (CA-4 a CA-9 y el aviso de asientos de CA-10), solo con `fireEvent`; zona forzada en la composición (corrección del paso 8b); commit `1531fa9` `test:` (traza, pasos 8 y 8b)
- [x] T7 · desarrollador-front · Green del mapa: `lib/mapa.ts`, `MapaAsientos.tsx` (el único con `'use client'`), `AsientosFuncion.tsx`, `app/funciones/[id]/page.tsx` y sin `prefetch={false}` en `FuncionesEvento.tsx`; lint, 137 pruebas, cobertura 99,6 %, build sin avisos, `curl` y Grep de D23; commit `c22ebb1` `feat:` (traza, paso 9)
- [x] T7b · desarrollador-front · `fix:` por decisión mía, fuera del plan: `enabled:hover:` en el botón «Continuar» deshabilitado (el enlace conserva `hover:`) y `console.error` de `getFuncion` y `getAsientos` nombrando la API de funciones; lint, 137 pruebas y build sin avisos; commit `41897c7` `fix:` (traza, paso 12)

## Prueba de recorrido

- [x] T11 · yo · ejecuté `herramientas/recorridos/004-mapa.mjs` con los dos servidores de producción: 37 comprobaciones, todas pasan; salida en `evidencia/interaccion.md` y capturas a 390 px en claro y oscuro en `evidencia/interaccion/`. Desviación aceptada por mí del paso 17: Next escribe la coma como `%2C` en la barra de direcciones; avisar para la spec 005 (traza, pasos 11 y 11b, O25)

## Controles

- [x] T8 · guardian-contrato · compara las dos entradas del contrato; «coincide», sin diferencias; evidencia en `evidencia/contrato.md` (traza, paso 13)
- [x] T9 · verificador-ui · cuatro rutas con `npm run verificar-ui`: «Resultado: pasa» (16 visitas sin axe serias o críticas, sin consola ni peticiones fallidas ni desborde; recorrido con Tab de 35, 41, 1 y 4 paradas con nombre, foco y 44 × 44; las cuatro rutas con `role="alert"` sin backend); tres hallazgos que no bloquean (H1 a H3); evidencia en `evidencia/ui/` y `evidencia/ui.md` (traza, paso 14)
- [x] T10 · revisor · «aprueba con observaciones»: 0 críticos, 0 altos, 0 medios y 7 bajos; mutación de `src/funciones` y `src/asientos` 100 % (93 mutantes, 0 sobrevivientes) frente a la línea base de T1 (100 %); Grep de D23 conforme; orden de commits correcto y mensajes de una sola línea; evidencia en `evidencia/revision.md` (traza, paso 15)

## Cierre

- [x] orquestador · llenó «Desviaciones» de `plan.md` y pasó las dos pruebas extra a «Pruebas sin criterio» (B7 del revisor; traza, paso 16)
- [x] T12 · yo · corrí Prettier en el backend (`d32de7d` `style:`), actualicé el README y `AGENTS.md` de los dos repositorios (`eb3cabb` y `eae744a` `docs:`), subí las ramas y abrí los pull requests #7 de `Taquillera-Backend` y de `TaquilleraFrontend`. Mis decisiones sobre los hallazgos están al final de `evidencia/revision.md` (traza, paso 17)
