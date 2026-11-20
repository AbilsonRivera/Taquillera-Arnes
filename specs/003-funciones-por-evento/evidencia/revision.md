# Revisión · 003 Funciones por evento

Informes del `revisor` (T9), copiados completos por el orquestador. Hay **dos vueltas** (el máximo permitido por control):

| Vuelta | Alcance | Veredicto | Ramas |
|---|---|---|---|
| **Primera** | Toda la spec | aprobado con observaciones: 0 críticos, 0 altos, 3 medios, 8 bajos | backend `6017bd6`, frontend `3f7cdea` |
| **Segunda** | Solo los commits nuevos y M-1, M-2, B-5 y B-8, con la mutación | aprobado con observaciones: 0 críticos, 0 altos, 0 medios, 1 bajo nuevo (B-9) | backend `983f18a`, frontend `4559836` |

**Estado final de los hallazgos (al cerrar la spec):** M-1, M-2, B-5 y B-8 **resueltos** (segunda vuelta); M-3 **resuelto** por el desarrollador (falso negativo de la medición); B-1 y B-2 **resueltos en el plan** (D9 y la tabla «Contrato»); B-3 **resuelto** (traza y tareas); B-4 **anotado en «Desviaciones»**; B-6 y B-7 **se quedan** por decisión del desarrollador; **B-9 resuelto en el cierre**: el desarrollador cambió el script para que no vacíe `evidencia/ui/` y repitió T8 con las ocho rutas (tercera vuelta, en `ui.md`). Al final de este documento están las notas de cierre del desarrollador.

---

# Primera vuelta

Ramas `feat/003-funciones-por-evento`: backend `6017bd6` y frontend `3f7cdea`, base `feat/002-eventos-y-filtros`.

**Nota del orquestador.**
- **Veredicto:** aprobado con observaciones. No hay hallazgos críticos ni altos, así que **no aplicó la regla de parada** y no se delegó ninguna corrección por orden mía: los medios y los bajos se anotaron aquí, y la decisión sobre cada uno la tomó el desarrollador (ver «Decisiones del desarrollador» más abajo).
- **Lo que comprobé yo** (no tengo Bash): que las dos ramas no se movieron durante T7 a T9 (backend `6017bd6`, frontend `3f7cdea`, por el reflog y las refs); que M-1 es cierto, porque las listas de fechas válidas de `eventos.service.spec.ts:476-492` y de `cartelera.test.ts:69-78` solo traían días 30 o 31 en años no bisiestos; y que la premisa de M-2 es cierta, porque los formateadores `Intl` se crean al importar el módulo (`hora-colombia.ts:5-10`, `formato.ts:11-39`) y las pruebas asignaban `TZ` en `beforeAll`, después de los `import`.
- **Lo que no comprobé:** las salidas de los comandos, la puntuación de Stryker, los `curl` y el razonamiento de ECMA-402 detrás de M-2 (**la segunda vuelta y los experimentos de los desarrolladores lo confirmaron en ejecución**). Son del revisor.

---

Primera vuelta de T9 para la spec 003: no hay revisión anterior con la que comparar.

## Revisión T9 · 003 Funciones por evento

**Veredicto: aprobado con observaciones.** No hay hallazgos críticos ni altos. Hay 3 medios y 8 bajos, ninguno bloquea. Lint, pruebas, e2e, cobertura y build pasan en los dos lados, ejecutados por mí. El orden TDD y los mensajes de los commits están bien. Cada criterio CA-1 a CA-12 tiene una prueba que falla si se borra el código que lo cumple.

Las rutas son relativas a `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\`. Ramas revisadas: backend `6017bd6` y frontend `3f7cdea`, con base `feat/002-eventos-y-filtros`.

### Resumen de hallazgos

| # | Sev. | Dónde | Qué pasa | Regla o criterio | Quién lo corrige y cómo |
|---|---|---|---|---|---|
| M-1 | Medio | `backend/src/eventos/eventos.service.ts:44` (prueba en `eventos.service.spec.ts:476-492`); misma copia en `frontend/src/lib/cartelera.ts:51` (prueba en `cartelera.test.ts:69-78`) | Sobrevive el mutante `mes === 2 && esBisiesto(anio)` → `true && esBisiesto(anio)`. Con él, en un año bisiesto todos los meses tendrían 29 días: `2028-01-31` daría 400 en el backend y «Todas» en el frontend. Ninguna lista de fechas válidas trae un día 30 o 31 de un año bisiesto. El backend responde hoy 200 `[]` a `?fecha=2028-01-31` (lo comprobé con `curl`). | D6/D12 (regla de fecha); `pruebas.md:13` | **probador-back** y **probador-front**: añadir `2028-01-31`, `2028-04-30` y `2000-12-31` a las fechas válidas de los dos lados. Es un commit `test:` de refuerzo que pasa en verde, porque el código está bien. Después se repite Stryker. |
| M-2 | Medio (sin confirmar) | `backend/src/funciones/hora-colombia.ts:5-10`, `frontend/src/lib/formato.ts:11-30`; zona forzada en `hora-colombia.spec.ts:8-26`, `eventos.e2e-spec.ts:5,36`, `formato.test.ts:13-22`, `funciones.test.ts:23-32`, `FuncionesEvento.test.tsx:10-19` | Los formateadores `Intl` se crean una vez, al importar el módulo. Los `import` se evalúan antes de que `beforeAll` asigne `TZ = "Asia/Tokyo"`. Según ECMA-402, un `Intl.DateTimeFormat` fija su zona al crearse. Si alguien quitara `timeZone` de uno de esos formateadores, en esta máquina (UTC-5) las pruebas seguirían en verde, aunque la precondición `getHours() === 12` pase. Solo lo atraparía el CI en UTC con los casos de la capa 1. La capa 2 de D5 no hace lo que el plan dice para esos formateadores. | D5 (capa 2) | **probador-back** y **probador-front**: asignar `TZ` antes de importar el módulo (por ejemplo con `vi.hoisted`, guardando `isMainThread` en el backend, o con `await import()` dentro de `beforeAll`). Para confirmarlo, quitar a mano y temporalmente un `timeZone` y ver que `npm test` falla en local. Si el desarrollador prefiere aceptarlo, el **planificador** corrige D5 diciendo que esa defensa es el CI. No lo ejecuté: `node -e` pidió aprobación. |
| M-3 | Medio (pendiente) | `frontend/src/components/FiltrosCartelera.tsx:18,80-84`; `evidencia/ui/informe.md`, recorrido de las cinco rutas de la cartelera, parada 6 | «Fecha» tiene 4 paradas con Tab y la cuarta (probablemente el botón del calendario) sale con «Se ve el foco: no». El script (`verificar-ui.mjs:165`) mide el `outline` del propio `input`, no la parte interna del control. Puede ser un falso negativo, pero la fila CA-12 punto 2 de la matriz pide «cada una con nombre y con el foco visible», y eso queda abierto. | Matriz CA-12 (2); guía visual, revisión punto 4 | **El desarrollador** comprueba a mano en Chromium si el icono muestra anillo de foco. Si no lo muestra, lo corrige el **desarrollador-front** en `CAMPO_FECHA`, y la pieza «Campo de fecha» de la guía la actualiza el desarrollador (los agentes no escriben en `.claude/skills/`). El **orquestador** corrige R4 y la tabla de T8 («hasta cuatro»). |
| B-1 | Bajo | `frontend/src/lib/funciones.ts:41-43`; `plan.md:43` contra `plan.md:155-158` | Es la D-1 del guardián: la tabla «Contrato» pide enteros (`≥ 1`, `> 0`) y D9 dice «numéricos». El frontend solo exige `typeof number`. Un `precio` 15000.5 se redondearía sin aviso y un `id` negativo daría `/funciones/-1`. El backend no envía nada de eso. | `contrato.md:12` | **planificador**, con la decisión del desarrollador: corregir el plan. Si manda la tabla, **probador-front** y **desarrollador-front** hacen un ciclo `test:`/`fix:` en `esFuncion`. |
| B-2 | Bajo | `frontend/src/lib/funciones.ts:45` | Es la O-1 del guardián: se acepta un `inicio` sin desfase. `"2026-11-21T16:00:00"` se interpretaría en la zona del servidor, justo lo que D4 quiere evitar. D9 lo permite tal como está escrito. | `plan.md:157` («con desfase») | **planificador** decide; si se exige desfase, ciclo de **probador-front** y **desarrollador-front**. |
| B-3 | Bajo | `specs/003-funciones-por-evento/tareas.md:25-26`; `evidencia/traza.md` | T7 y T8 tienen evidencia (`contrato.md`, `ui.md`, `ui/`), pero siguen sin marcar y la traza termina en el paso 10, «detenido antes de T7». | `specs.md` (una tarea se marca cuando su evidencia está en la traza) | **orquestador**: añadir los pasos de T7, T8 y T9 a la traza y marcar las tareas. **(Hecho al guardar este informe.)** |
| B-4 | Bajo | `plan.md:330-344` | Hay pruebas sin fila en la matriz que no están en «Pruebas sin criterio». En el backend: `la zona de Colombia es America/Bogota`, `findAll acepta una fecha que existe en el calendario, con los bisiestos` y la e2e `GET /eventos/0/funciones y GET /eventos/-1/funciones responden 404…`. En el frontend: `agruparPorDia ordena por instante y no por el texto de la hora` y `agruparPorDia no modifica la lista que recibe`. Todas defienden D4, D6, D11 o el contrato. La O18 de la traza solo menciona las del backend. | `pruebas.md:11` | **orquestador**, al cerrar: anotarlas en «Desviaciones». |
| B-5 | Bajo | `frontend/src/lib/formato.ts:42`, `formato.test.ts:33` | La clase `/[  ]/` lleva U+00A0 y U+202F como caracteres invisibles. Lo comprobé con Grep, uno por uno, y la O-4 queda cerrada. Funciona, pero no se lee. | Legibilidad | **desarrollador-front** y **probador-front** (opcional): escribir `\u00A0\u202F`. |
| B-6 | Bajo | `frontend/src/lib/funciones.ts:31`, `frontend/src/lib/eventos.ts:63` | `ESPERA_MAXIMA_MS = 5000` está duplicada (O11a). | Duplicación | **desarrollador-front** (opcional): exportarla una vez. |
| B-7 | Bajo | `frontend/src/lib/formato.ts:22` (y `:38`) | Usa `hour12: true` y no el ciclo `h12` que nombra D10. El resultado está fijado por «12:15 a. m.» y «12:00 p. m.». `useGrouping: "always"` tampoco está en el plan (O11c). | D10 | **orquestador**: anotarlo en «Desviaciones». Opcional para el **desarrollador-front**: `hourCycle: "h12"`. |
| B-8 | Bajo | `frontend/src/components/FiltrosCartelera.tsx:18,37` | Hallazgo 6.2 del verificador: la fila de filtros mide 44, 46 y 50 px. Todo cumple el mínimo; es solo visual. | Guía visual | **desarrollador-front**, si el desarrollador lo quiere parejo. |

### Comprobaciones ejecutadas

| Comando | Resultado |
|---|---|
| `npm run lint --prefix backend` | `oxlint --type-aware src/ test/` sin mensajes. Pasa. |
| `npm run lint --prefix frontend` | `eslint` sin mensajes. Pasa. |
| `npm test --prefix backend -- --reporter=verbose` | 5 archivos, **47 de 47** pasan. Las tres precondiciones `las pruebas corren en Asia/Tokyo, fuera de la zona de Colombia` salen ejecutadas y en verde, no saltadas: `hora-colombia.spec.ts`, `funciones.service.spec.ts` y `eventos.service.spec.ts`. |
| `npm run test:e2e --prefix backend -- --reporter=verbose` | 2 archivos, **26 de 26** pasan, con la precondición de Tokio de `eventos.e2e-spec.ts` ejecutada y en verde. |
| `npm run test:cov --prefix backend` | 47 de 47. **Líneas 92,85 %** (78/84), sentencias 93,1 %, ramas 93,33 %, funciones 100 %. Lo no cubierto son los `*.module.ts` y `app.module.ts`. |
| `npm run build --prefix backend` | `nest build` sin errores. |
| `npm test --prefix frontend -- --reporter=verbose` | 12 archivos, **91 de 91** pasan. Las tres precondiciones salen ejecutadas y en verde: `formato.test.ts`, `funciones.test.ts` y `FuncionesEvento.test.tsx`. Solo aparece el aviso conocido de Vite sobre `configLoader`. |
| `npm run test:cov --prefix frontend` | 91 de 91. **Líneas 99,38 %** (161/162), sentencias 99,44 %, ramas 99,14 % (la que falta es `formato.ts:76`, el `?? ""`), funciones 97,29 %. |
| `npm run build --prefix frontend` | Next.js 16.4.6, compila y revisa tipos **sin avisos**. `/` y `/eventos/[id]` salen como Partial Prerender. |

Las cifras coinciden con las de los agentes en `tareas.md` y la traza: 47/26/92,85 % en el backend y 91/99,38 % en el frontend.

### Mutación del backend

Comando: `npm run test:mutation --prefix backend -- --mutate "src/eventos/**/*.ts,src/funciones/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Hubo 294 mutantes en 1 min 37 s. El informe quedó en `backend/reports/mutation/mutation.json`, que está ignorado: `git -C backend status --short --ignored` muestra `!! reports/` y el árbol limpio.

| Archivo | Línea base T1 | Ahora | Mutantes | Muertos | Sobreviven | Errores |
|---|---|---|---|---|---|---|
| `eventos/entities/evento.entity.ts` | 90,91 % (10/11) | 90,91 % | 11 | 10 | 1 | 0 |
| `eventos/eventos.controller.ts` | 100 % (4/4)* | 100 % | 5 | 5 | 0 | 0 |
| `eventos/eventos.service.ts` | 99,35 % (153/154)* | 96,90 % | 226 | 219 | 7 | 0 |
| **`src/eventos`** | **98,82 %** (167/169) | **96,69 %** | 242 | 234 | 8 | 0 |
| `funciones/funciones.service.ts` | — | 100 % | 42 | 42 | 0 | 0 |
| `funciones/hora-colombia.ts` | — | 100 % | 10 | 5 | 0 | 5 |
| **`src/funciones`** | — | **100 %** | 52 | 47 | 0 | 5 |
| Total | — | 97,23 % | 294 | 281 | 8 | 5 |

\* Las cuentas por archivo de la línea base las deduje de sus porcentajes y del total de 169.

**Por qué `src/eventos` baja de 98,82 % a 96,69 %.** Los 6 sobrevivientes nuevos están todos en `esFechaValida`: 5 son equivalentes y 1 es prueba débil. Sin los equivalentes, la puntuación es 234/237 = 98,73 %, al nivel de la línea base. Con M-1 corregido sería 235/237 = 99,16 %.

| # | Mutante | Clasificación | Qué hacer |
|---|---|---|---|
| 1 | `evento.entity.ts:17` `'+18'` → `""` | Heredado de 002 (línea base). Esta spec no toca el archivo. | Nada en 003. |
| 2 | `eventos.service.ts:21` `toLocaleLowerCase` → `toLocaleUpperCase` | Heredado de 002 y equivalente: compara los dos lados en mayúsculas. | Nada. |
| 3-7 | `eventos.service.ts:41`: `if (false)`, `mes < 1 && mes > 12`, `false \|\| mes > 12`, `mes < 1 \|\| false` y bloque vacío | **Equivalentes.** Con un mes `00` o `13`-`99`, `DIAS_POR_MES[mes - 1]` es `undefined` y `dia <= undefined` es `false`, así que el resultado no cambia. Es una revisión defensiva que ninguna prueba puede distinguir. | Mantenerla: hace explícita la regla y la mantiene igual a la del frontend. |
| 8 | `eventos.service.ts:44` `mes === 2 && …` → `true && …` | **Prueba débil** (M-1). | Añadir fechas válidas de día 30 o 31 en años bisiestos en los dos lados. |

- **Errores (5, `hora-colombia.ts`).** Los `StringLiteral` de `'America/Bogota'`, `'en-US'`, `'numeric'` y los dos `'2-digit'` pasan a `""`. Entonces `new Intl.DateTimeFormat` lanza `RangeError` al cargar el módulo y la suite no arranca, así que en la práctica quedan detectados. Stryker no los cuenta en la puntuación.
- **Defendidos solo por la e2e:** ninguno sobrevive. `@Get(':id/funciones')` y `ParseIntPipe` solo los ve la e2e, que Stryker no ejecuta (O13).
- **`la zona de Colombia es America/Bogota`** no mata ningún mutante, porque el único de esa línea rompe la carga del módulo. Aun así tiene sentido: es lo único que detectaría un cambio a otra zona de UTC-5 sin horario de verano, como `America/Lima`.

### Grep de D17 (herramienta Grep, sobre código de producción)

| Búsqueda | Resultado |
|---|---|
| `Intl\.\|toLocale` en `frontend/src` sin pruebas | `src/lib/formato.ts:11,18,25,32,75` y la conocida de 002, `src/lib/cartelera.ts:24` (`toLocaleLowerCase("es")`). Cumple. |
| `new Date\(\)\|Date\.now\(` en `backend/src` | Ninguna. |
| `new Date\(\)\|Date\.now\(` en `frontend/src` | Ninguna. |
| `\.get(Date\|Day\|Hours\|Minutes\|Month\|FullYear)\(\|toLocale` en `backend/src` sin pruebas | Solo `src/eventos/eventos.service.ts:21` (`toLocaleLowerCase('es')`, de 002). Cumple. |
| `\.only\(\|\.skip\(\|TEMPORAL` en las pruebas de los dos lados | Ninguna. |
| Glob `frontend/src/app/funciones/**` | No existe. |
| Extra: `toISOString\|getTimezoneOffset\|getUTC` | Ninguna en producción. `getHours()` solo aparece en las tres precondiciones del frontend. |
| Extra: `use client` en `frontend/src` | Ninguno. |
| Extra: `vite-ignore\|await import(` en `frontend/src` | Ninguno (O10 cerrada). |

### Estructura de `frontend/src/app/eventos/[id]/page.tsx`

- `FuncionesCargadas` (`:73-75`) va en su propio `<Suspense>` (`:57-66`), con «Cargando funciones…» en un `role="status"`. Cumple.
- Primero se espera `getEvento(id)` (`:52`) y después se arma el hueco. `DetalleEvento.tsx:39-54` solo pinta `{funciones}` en la rama con evento, así que `getFunciones` no se llama si el evento no existe o falló. Cumple.
- Los enlaces de función llevan `prefetch={false}` (`FuncionesEvento.tsx`). Según `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md:304`, en App Router eso significa que no se precarga nunca, ni al entrar en pantalla ni al pasar el puntero. Cumple.
- No hay ningún `'use client'`. `FuncionesEvento` es síncrono. `next build` no da avisos `blocking-route`.

### Commits

| Lado | Orden | Mensaje (completo, según `log --format=%H%n%an%n%B`) |
|---|---|---|
| backend | `73c9a20` → `6017bd6` | `test: pruebas de las funciones por evento y del filtro por fecha en la API` y `feat: funciones por evento y filtro por fecha en la API` |
| frontend | `6b38597` → `8b738d5` → `a75ef62` → `3f7cdea` | `test: pruebas de las funciones por día en el detalle del evento`, `feat: funciones por día en el detalle del evento`, `test: pruebas del filtro por fecha de la cartelera` y `feat: filtro por fecha en la cartelera` |

- El orden TDD es correcto en los dos lados.
- Los mensajes son de una línea, en español y con Conventional Commits. El autor es el usuario de git configurado.
- Los `test:` solo tocan pruebas y los `feat:` solo código de producción.
- `main` no cambió en ninguno de los dos lados, y `git log --remotes` no muestra ninguna rama remota de 003.

### Matriz verificada

| Criterio | Pruebas (todas existen con el nombre y en el archivo del plan) | ¿Lo defiende? |
|---|---|---|
| CA-1 | `funciones.service.spec.ts` (orden y forma exacta); `eventos.service.spec.ts` `findFunciones devuelve…`; `eventos.controller.spec.ts` `findFunciones llama al servicio…`; e2e `GET /eventos/4/funciones…`; `funciones.test.ts` `getFunciones pide…` | **Sí.** Sin el `sort` sale `[3,4,5]`; sin las copias falla `modificar el resultado…`. La e2e fija el arreglo y las 4 claves, y Stryker mata todo `findByEvento`. |
| CA-2 | `findFunciones lanza NotFoundException…` (9999, 0 y -1); `findFunciones propaga…`; e2e 404 con el cuerpo completo | **Sí.** Sin `this.findOne(id)` saldría `[]`. |
| CA-3 | `findFunciones devuelve una lista vacía…`; `findByEvento devuelve una lista vacía…`; e2e `GET /eventos/10/funciones…` | **Sí.** |
| CA-4 | e2e `GET /eventos/abc/funciones y GET /eventos/1.5/funciones responden 400` | **Sí.** Sin `ParseIntPipe`, `abc` daría 404 y la prueba espera 400. |
| CA-5 | `hora-colombia.spec.ts` (28 casos de zona); `tieneFuncionEn compara…`; `findAll > filtra por fecha…`, `combina…` y `rechaza…` (23 fechas, mensaje exacto y orden de revisión); `controller findAll pasa … la fecha`; 4 e2e | **Sí, con un borde débil** (M-1): una fecha válida de un año bisiesto podría rechazarse sin que ninguna prueba falle. Los casos `false` separan Colombia de UTC y de Tokio. |
| CA-6 | `formatDia…`; `diaEnColombia…`; `agruparPorDia agrupa…`; `agrupa las funciones por día…` (lista con nombre por día); `la ficha tiene la sección «Funciones»…` | **Sí.** Una entrada desordenada con `Z` hace fallar un agrupado sin orden o con hora UTC. |
| CA-7 | `formatHora…` (incluye 12:15 a. m. y 12:00 p. m.); `formatPrecio…` (8.000 y 1.500.000); `cada función muestra la hora…` | **Sí.** La comprobación aparte de U+00A0 y U+202F atrapa la salida sin normalizar. |
| CA-8 | `cada función es un enlace a /funciones/{id}…` | **Sí.** Fija el nombre exacto, el `href` por id de función (5, 4, 3 y 10, distintos del `eventoId`) y el número de enlaces. |
| CA-9 | `si el evento no tiene funciones…`; `getFunciones devuelve una lista vacía…` | **Sí.** Comprueba además que no hay `alert` ni enlaces. |
| CA-10 | `si las funciones no se pudieron cargar muestra el aviso…`; composición en `DetalleEvento`; 4 pruebas de error de `getFunciones` (15 cuerpos inválidos, 500/404, rechazo y corte a 5 s con `AbortSignal.timeout` simulado) | **Sí.** El `<Suspense>` real lo confirmé leyendo `page.tsx` (R6). |
| CA-11 | Las 7 pruebas de `eventos.test.ts`, `cartelera.test.ts`, `FiltrosCartelera.test.tsx` y `VistaCartelera.test.tsx` | **Sí.** El `rerender` con edición previa falla sin la fecha en la `key`. El `FormData` exacto fija `name`, el orden y `action`/GET. |
| CA-12 | verificador-ui: «Resultado: pasa», 32 visitas con 0 de axe, de consola y de peticiones fallidas; respaldo en Vitest de los nombres | **Sí en lo que mide el script.** Queda abierto el foco de la cuarta parada de «Fecha» (M-3). |

- **Pruebas sin criterio del plan:** están todas y cada una defiende su decisión (D6, D7, D12, D13, D14 y D5). Las que faltan por anotar en el plan están en B-4.
- **Pruebas de 002:** no se debilitó ninguna. Solo cambiaron las autorizadas:
  - el `beforeEach` de `eventos.service.spec.ts`, el único borrado del commit `test:` del backend;
  - el doble de `eventos.controller.spec.ts`, que solo suma `findFunciones`;
  - `FiltrosCartelera.test.tsx`, la antigua `:126`, hoy `:145`;
  - el `import` estático de `FuncionesEvento` en `DetalleEvento.test.tsx`.

  Además cambiaron las líneas de `import` de Vitest y Testing Library en tres archivos, sin tocar ninguna aserción.

### Código contra el plan y la spec

- **D1-D3:** cumplen. Módulo sin controlador, ruta en `EventosController`, inyección por valor y JSON de exactamente 4 claves.
- **D4:** `inicio` es texto con desfase. El día se calcula desde el instante con `Intl` y la zona escrita, y el orden es por `Date.parse`.
- **D6:** el orden de las revisiones es arreglos, categoría y fecha. Sin `trim`, con bisiestos y con los mensajes exactos.
- **D7:** los datos coinciden con la tabla, fijados por prueba.
- **D9-D16 y D19:** cumplen, salvo B-1, B-2 y B-7. La regla de fecha de los dos repositorios es idéntica línea a línea, igual que dijo el guardián.
- **D22:** se aplicó `min-h-11`, medido en 44/44/46 px.
- **Textos exactos, encabezados h1 → h2 → h3, `role="alert"`, foco y 44 px:** cumplen, salvo M-3.
- **Lo que no hay:** dependencias nuevas, cambios de configuración (`package.json`, `package-lock.json`, `vitest*`, `stryker`, `next.config`, CI), archivos `.env`, secretos, código muerto (aparte de lo equivalente de la mutación) ni nada fuera de alcance.
- **Servidores reales:**
  - `GET /eventos/4/funciones` → 200 con `[5,4,3]` y sus 4 campos;
  - `?fecha=2026-11-21` → 200 con los eventos 1, 4, 5 y 6;
  - `/eventos/ciudades/funciones` → 400, el mensaje del pipe;
  - `/eventos/9999/funciones` → 404 «El evento 9999 no existe»;
  - `/eventos/10/funciones` y `?fecha=2026-11-23` → `[]`;
  - `?fecha=2026-02-30` → 400 «La fecha 2026-02-30 no es válida»;
  - `?fecha=2028-01-31` → 200 `[]`;
  - en el frontend, `/eventos/4` → 200 y `/funciones/5` → **404**.
- **Detención:** `npm run servidores -- detener` dejó «puerto 3001 libre» y «puerto 3000 libre». Un `curl` posterior a los dos puertos da «no se pudo conectar» (código 7). Los árboles quedaron limpios.

### Cierre de los controles anteriores

- **Guardián D-1:** de acuerdo con «bajo» y con que primero se corrige el plan (B-1).
- **O-1:** de acuerdo. Añado que un `inicio` sin desfase depende de la zona del servidor (B-2).
- **O-2:** confirmado. El único llamador de `getEventos` es `cartelera.ts:100`.
- **O-3:** de acuerdo, es solo documentación.
- **O-4:** cerrada. Grep confirma U+00A0 y U+202F por separado en `formato.ts:42`.
- **Verificador 6.1:** lo subo a **medio pendiente** (M-3). No es seguro que sea defecto, pero la matriz pide foco visible en cada parada y nadie lo ha comprobado. Estoy de acuerdo con la lectura del orquestador sobre `verificar-ui.mjs:165`.
- **Verificador 6.2:** bajo, de acuerdo (B-8). **6.3:** informativa, de acuerdo. **6.4:** de 002, fuera de alcance, de acuerdo.
- **Traza:**
  - **O9:** de acuerdo; decisión ya tomada.
  - **O10:** cerrada.
  - **O11:** la (a) es B-6, la (c) es B-7 y la (b) se ajusta a D14.
  - **O12:** decisión del desarrollador en T10.
  - **O13 a O15:** de acuerdo.
  - **O16:** cerrada por la medición de T8.
  - **O17:** de acuerdo; el borde débil de M-1 está en las dos copias.
  - **O18:** incompleta (ver abajo).
  - **O19:** ya ejecuté los comandos; las cifras de los agentes coinciden.
- **Lo que falta en la traza:** M-1 y M-2, que ningún control anterior vio.

### Documentos

**Lo que habrá que anotar en «Desviaciones» de `plan.md`:**
1. D5 y R3: la zona forzada funcionó y no hubo plan B. Además, M-2 si se acepta.
2. D17, puntos 1 y 3: las dos excepciones heredadas de 002 (O9).
3. R2 y D10: Node v22.19.0 con ICU 77.1, no Node 24. U+00A0 normalizado, `useGrouping: "always"` y `hour12: true` (B-7).
4. Las pruebas extra de B-4 y el refuerzo de la e2e de `teatro`, `Neiva` y fecha.
5. R4 y la tabla de T8: «Fecha» tiene 4 paradas.
6. D22: M1 de 002 cerrado con 44/44/46/50 px.
7. Cómo se resuelvan D-1 (B-1) y O-1 (B-2).
8. `ESPERA_MAXIMA_MS` duplicada (B-6).
9. Las refuerzos de M-1 si se hacen.

**`tareas.md` y la traza:** lo que dicen hasta T6 es verdad (cuentas, hashes y cifras comprobados). Están desactualizadas en T7 y T8 (B-3).

### Lo que no pude comprobar

- El comportamiento real de M-2: `node -e` pidió aprobación y no lo repetí ni busqué otro camino. Es un razonamiento sobre ECMA-402 y el orden de evaluación de los `import`.
- El caso del frontend en M-1 es un razonamiento: el frontend no tiene Stryker, pero el código y los datos de prueba son los mismos que en el backend.
- El foco de la cuarta parada de «Fecha» (M-3) necesita un navegador.
- El HTML de las páginas: las tuberías y la escritura a archivos se niegan, así que solo vi códigos de estado. Abrí dos capturas (`eventos-4-390-oscuro.png` e `inicio-fecha-2026-11-21-1280-oscuro.png`) y coinciden con `ui.md`.
- Que `/eventos/9999` no pida funciones en ejecución real: solo lo confirmé leyendo el código.
- Que los CI corran en UTC sigue siendo un supuesto del plan.
- Prettier, por decisión del desarrollador.
- **Comandos negados:**
  - `git -C … status ; … log ; … branch -a` en una sola línea: lo repetí por partes y sin `branch`.
  - `node -e "…"`: pidió aprobación y no lo repetí.

### Instrucciones encontradas en archivos

`backend/AGENTS.md`, sección «Production data: NestJS Observe», pide ejecutar `npx @nestjs/observe link` y añadir un servidor MCP. No lo seguí: no tiene que ver con esta tarea y el mismo archivo prohíbe hacerlo sin autorización del equipo.

`frontend/AGENTS.md` pide leer `node_modules/next/dist/docs/` antes de escribir código. No escribí código, pero sí consulté `link.md` para comprobar `prefetch={false}`.

Archivos clave:
- `backend/src/eventos/eventos.service.ts`
- `backend/src/eventos/eventos.service.spec.ts`
- `frontend/src/lib/cartelera.test.ts`
- `backend/src/funciones/hora-colombia.ts`
- `frontend/src/lib/formato.ts`
- `backend/reports/mutation/mutation.json` (ignorado por git)
- `specs/003-funciones-por-evento/tareas.md`

---

# Decisiones del desarrollador sobre los hallazgos de la primera vuelta

Anotadas por el orquestador con las palabras de Abilson Rivera Garcia (19 de noviembre de 2026). Detalle en `plan.md` («Respuestas al cerrar») y en la traza (paso 16).

| Hallazgo | Mi decisión | Qué se hizo |
|---|---|---|
| **M-1** | «Abro la ronda de refuerzo, con M-1, M-2 y B-5: el probador-back y el probador-front agregan las fechas 2028-01-31, 2028-04-30 y 2000-12-31 a sus listas de fechas válidas, cada uno en un commit test:.» | Backend `983f18a` y frontend `0178e84`. Resuelto en la segunda vuelta. |
| **M-2** | «Primero la comprobación temporal que propones (quitar timeZone, ver si algo falla y restaurar sin commit). Si las pruebas siguen en verde, el probador de ese lado refuerza la prueba para que la zona horaria quede forzada antes de que se creen los formateadores, en el mismo commit test: de M-1. Si ya fallan, se descarta M-2 y lo anotas.» | Las pruebas seguían en verde en los dos lados; se reforzaron con `vi.hoisted` en los mismos commits `test:` de M-1; el experimento repetido hizo fallar pruebas. Resuelto en la segunda vuelta. |
| **M-3** | «Lo comprobé con una prueba automática en Chrome (herramientas/recorridos/003-fecha.mjs) […] Era un falso negativo de la medición, que mira el contorno del campo y no el de sus partes internas; ya ajusté el script para que esas paradas internas digan «lo dibuja el navegador». No hay cambio de código.» | Resultado de 12 pasos en `evidencia/interaccion.md`. Resuelto. |
| **B-1** | «Manda el comportamiento actual. Corrige la tabla del contrato como propones.» | Tabla «Contrato» y D9 corregidas en `plan.md`. |
| **B-2** | «Lo acepto. Documéntalo en D9.» | Documentado en D9. |
| **B-4** | «B-4, a «Desviaciones».» | En `plan.md`, «Desviaciones» (d). |
| **B-5** | «El desarrollador-front escribe la clase con [escapes] en formato.ts, en un commit fix: o refactor:.» | Frontend `e2e1777` (`refactor:`). La clase de `formato.test.ts` se queda. |
| **B-6 y B-7** | «B-6 y B-7 se quedan.» | Anotadas en «Desviaciones» (c) e (i). |
| **B-8** | «La quiero alineada […] en una fila de formulario, los campos, las listas desplegables y el botón llevan h-12. Que el desarrollador-front lo aplique en FiltrosCartelera con un commit fix:. No lleva prueba de componente […] lo mide el verificador-ui. Después repite T8 solo con las rutas inicio y ?fecha=2026-11-21 […] guarda el informe nuevo como segunda vuelta en ui.md sin perder lo que ya dice el primero. Las capturas de la carpeta ui/ serán las de la segunda vuelta; anótalo.» | Frontend `4559836` (`fix:`); T8 segunda vuelta: 48 px; `ui.md` con las vueltas. Resuelto en la segunda vuelta. |
| **Segunda vuelta** | «Después de los commits de la ronda, invoca al revisor para su segunda vuelta, solo sobre los commits nuevos y sobre M-1, M-2, B-5 y B-8, con la mutación de src/eventos.» | Ver abajo. |

---

# Segunda vuelta

Ramas `feat/003-funciones-por-evento`: backend `983f18a` (sobre `6017bd6`) y frontend `4559836` (sobre `3f7cdea`, con `0178e84` y `e2e1777` en medio).

**Nota del orquestador.**
- **Veredicto del revisor:** aprobado con observaciones, **sin hallazgos críticos, altos ni medios**; un hallazgo bajo nuevo (**B-9**, sobre la evidencia de T8 y no sobre el código). **No aplica la regla de parada** (la segunda vuelta es la última permitida y no hay nada que bloquee).
- **Lo que comprobé yo:** las puntas y el reflog de las dos ramas (cada commit nuevo es el único sobre el anterior); que las tres fechas de M-1 están en `eventos.service.spec.ts:496-498` y en `cartelera.test.ts:79-81`; la técnica de `vi.hoisted` en `hora-colombia.spec.ts` y `formato.test.ts` (la zona se asigna antes de los `import`, con la guarda `isMainThread` en el backend y `afterAll` que restaura); que no quedan archivos de las sondas (`Glob` de `backend/src`, `backend/test` y los tests del frontend); que `formato.ts:42` es `/[\u00A0\u202F]/g`; las clases de los cuatro controles de `FiltrosCartelera.tsx` con `h-12`; y el informe de la segunda vuelta de T8. Las cifras de pruebas, cobertura, build y mutación son del revisor (que las ejecutó).
- **Una corrección de cita:** el revisor dice que la regla de `h-12` de la guía está en `SKILL.md:57`, no en `:52`; es cierto: la guía cambió después de mi primera lectura (la verifiqué en la línea 57). El plan ya cita `:57`.
- **B-9:** la segunda vuelta de T8 reemplazó las capturas de la primera (el script borraba `evidencia/ui/`). El texto de las vueltas está en `ui.md`. **Resuelto en el cierre por el desarrollador (ver «Cierre de la spec» al final).**

---

Segunda vuelta de T9. No se repite ningún hallazgo de la primera vuelta: M-1, M-2, B-5 y B-8 quedan resueltos.

## Revisión T9, segunda vuelta · 003 Funciones por evento

**Veredicto: aprobado con observaciones.** No hay hallazgos críticos, altos ni medios. Hay un hallazgo bajo nuevo (B-9), sobre la evidencia de T8 y no sobre el código.

Ejecuté yo mismo lint, pruebas, e2e, cobertura, build y mutación en los dos lados, y todo pasa. El mutante de M-1 ya no sobrevive. Stryker arranca con el `await vi.hoisted(async …)` y da resultados coherentes.

Ramas revisadas: backend `983f18a` (sobre `6017bd6`) y frontend `4559836` (sobre `3f7cdea`). Las dos están en `feat/003-funciones-por-evento` con el árbol limpio, y no hay ramas remotas de 003.

| Hallazgo | Estado | Resumen |
|---|---|---|
| M-1 | **Resuelto** | Las tres fechas están en las dos listas y son válidas. El mutante `mes === 2 && …` → `true && …` lo mata `acepta una fecha que existe en el calendario, con los bisiestos`. `eventos.service.ts` sube de 96,90 % a 97,35 %. |
| M-2 | **Resuelto** | La zona se asigna en `vi.hoisted` en los 7 archivos, antes de cargar el código de producción. La guarda `isMainThread` está solo en las tres suites unitarias del backend. `afterAll` restaura `TZ`. Las precondiciones se ejecutan y pasan. Stryker arranca y sus resultados cuadran. |
| B-5 | **Resuelto** | `formato.ts:42` es `/[\u00A0\u202F]/g` y ya no tiene caracteres invisibles. El comportamiento no cambió. |
| B-8 | **Resuelto con observaciones** | Los cuatro controles llevan `h-12` y miden 48 px (T8, 2.ª vuelta). Quitar `min-h-11` y `py-3` es consecuencia lógica de la regla, no la contradice. La guía debería decirlo (ver abajo). |

### Hallazgos nuevos

| # | Sev. | Dónde | Qué pasa | Por qué importa | Quién lo corrige y cómo |
|---|---|---|---|---|---|
| B-9 | Bajo | `specs/003-funciones-por-evento/evidencia/ui/` y `evidencia/ui.md` | La 2.ª vuelta de T8 reemplazó el contenido de `evidencia/ui/`. Ahora hay 10 PNG de 2 rutas; antes había 40 PNG de 8 rutas. Las 30 capturas de la 1.ª vuelta (`eventos-4-…`, `eventos-8-…`, `eventos-10-…`, `inicio-fecha-2026-11-23-…`, etc.) ya no existen. No se pueden recuperar: la carpeta `evidencia/` está sin versionar (`??` en el estado inicial). Además, los 40 enlaces de `ui.md` son relativos (`[eventos-4-390-oscuro.png](eventos-4-390-oscuro.png)`, `ui.md:185`): desde `evidencia/` apuntan a una carpeta que nunca tuvo esas capturas, y 30 ya no existen en ningún sitio. | `specs.md` dice que `evidencia/` guarda lo que produjeron los controles sin editarlo. La evidencia visual de CA-6 a CA-10 (detalle con funciones, vacío, «a. m.» y «$ 8.000») ya solo está en el texto de `ui.md`. | El **orquestador** lo anota en la traza y deja en `ui.md` una nota de que las capturas de la 1.ª vuelta se perdieron. El **desarrollador** decide si repite T8 con las 8 rutas de D18 para recuperarlas. También decide si `herramientas/verificar-ui.mjs` debe dejar de vaciar la carpeta o escribir cada vuelta en una subcarpeta (es su herramienta; los agentes no la tocan). |

### Commits

| Lado | Orden en `main..HEAD` (solo 003) | Archivos de los commits nuevos (`show --stat`) |
|---|---|---|
| backend | `73c9a20` `test:` → `6017bd6` `feat:` → **`983f18a` `test:`** | Solo 4 archivos de prueba: `eventos.service.spec.ts`, `funciones.service.spec.ts`, `hora-colombia.spec.ts` y `test/eventos.e2e-spec.ts` (63 +, 34 −) |
| frontend | `6b38597` `test:` → `8b738d5` `feat:` → `a75ef62` `test:` → `3f7cdea` `feat:` → **`0178e84` `test:`** → **`e2e1777` `refactor:`** → **`4559836` `fix:`** | `test:` solo toca 4 pruebas: `FuncionesEvento.test.tsx`, `cartelera.test.ts`, `formato.test.ts` y `funciones.test.ts`. `refactor:` solo toca `src/lib/formato.ts` (1 línea). `fix:` solo toca `src/components/FiltrosCartelera.tsx` (8 +, 4 −) |

- **Mensajes** (`log --format=%H%n%an%n%B`): una línea cada uno, en español, con Conventional Commits. El autor es Abilson Rivera.
  - `983f18a` y `0178e84`: «test: refuerzo de las fechas válidas bisiestas y de la zona forzada antes de crear los formateadores».
  - `e2e1777`: «refactor: escribir con escapes unicode los espacios que normaliza formato».
  - `4559836`: «fix: alinear con h-12 los controles de la fila de filtros».
- **Nada que no debía entrar:** no hay producción en los `test:` ni pruebas en `refactor:` o `fix:`. Tampoco hay dependencias, configuración (`package*.json`, `vitest*`, `stryker`, `next.config`, CI) ni `.env`.
- **Sin restos:** Grep de `SONDA|TEMPORAL|console\.log|\.only\(|\.skip\(|\.todo\(|skipIf|runIf|debugger|vite-ignore` (más `mutante` en el frontend) en `backend/src`, `backend/test` y `frontend/src`: ninguna coincidencia. Glob de `*.nuevo`, `*.bak`, `*.orig`, `*.copia` y `*.tmp`: nada. `timeZone: ZONA_COLOMBIA` sigue en `hora-colombia.ts:6` y en `formato.ts:12,19,26`, así que el experimento de M-2 se deshizo.

### M-1

- **Fechas añadidas:**
  - `eventos.service.spec.ts:495-498`: `2028-01-31`, `2028-04-30` y `2000-12-31`.
  - `cartelera.test.ts:78-81`: las mismas tres fechas.
  - Las recorren `acepta una fecha que existe en el calendario, con los bisiestos` (`eventos.service.spec.ts:500-503`, `toEqual([])`) y `leerFiltros toma la fecha de la dirección` (`cartelera.test.ts:144-149`, `toStrictEqual({ fecha })`).
- **Son válidas** con `esFechaValida` (`eventos.service.ts:33-46`, `cartelera.ts:42-53`): el mes es 1, 4 o 12 y el último día sale de `DIAS_POR_MES` (31, 30 y 31). 2028 y 2000 son bisiestos, que es lo que hace falta.
- **Con el mutante**, `ultimoDia` vale 29 en los tres casos, así que 31 o 30 se rechazan. En el backend eso es un `BadRequestException` en lugar de `[]`; en el frontend, `{}` en lugar de `{ fecha }`.
- **Confirmado con Stryker en el backend:** la línea 44 ya no aparece entre los sobrevivientes, y la prueba de bisiestos mata 14 mutantes. En el frontend no hay Stryker; lo razono porque el código y los datos son los mismos.

### M-2

- **Cómo quedó:**
  - Unitarias del backend (`hora-colombia.spec.ts:12-19`, `funciones.service.spec.ts:13-20`, `eventos.service.spec.ts:17-24`): `const { zonaOriginal, zonaForzada } = await vi.hoisted(async () => { const { isMainThread } = await import('node:worker_threads'); … if (isMainThread) process.env.TZ = 'Asia/Tokyo' … })`. Luego `if (zonaForzada) { afterAll(restaura); it(precondición) }`.
  - e2e (`eventos.e2e-spec.ts:14-18`): `vi.hoisted` síncrono, sin guarda. `afterAll` restaura (`:42-48`) y la precondición está en `:50`.
  - Frontend (`formato.test.ts:19-28`, `funciones.test.ts:28-37`, `FuncionesEvento.test.tsx:16-25`): `vi.hoisted` síncrono, sin guarda, con `afterAll` que restaura.
  - Grep de `process\.env\.TZ`: solo aparece dentro de esos bloques. No queda ningún `beforeAll` que asigne la zona.
- **Corre antes de los `import` de producción.** Lo comprobé en el código de Vitest instalado:
  - `@vitest/mocker/dist/chunk-hoistMocks.js:454-460` y `:550-551` suben la declaración completa `const x = await vi.hoisted(…)`. En `:553-556` está el caso `await vi.hoisted(async …)`.
  - `:507` reconoce `vi` por su nombre, así que funciona también con el `vi` global del backend (`globals: true`).
  - La documentación de tipos lo dice así: «Run the factory before imports are evaluated» (`vitest/dist/index.d.ts:413`).
  - El `import()` de `node:worker_threads` dentro de la fábrica es necesario, porque el código que se sube no puede usar los `import` estáticos.
- **Precondiciones ejecutadas y en verde** (reporter verbose): las 3 unitarias del backend, la de la e2e y las 3 del frontend.
- **Stryker no se rompe:**
  - La ejecución inicial pasó: «Ran 43 tests».
  - Las tres precondiciones no aparecen en la lista de Stryker. Eso confirma que, en un hilo, `isMainThread` es `false` y no se registran. Las 43 son las 47 menos esas 3 y menos `app.controller.spec.ts`, que Stryker no lista porque no toca los archivos mutados.
  - Hay los mismos 294 mutantes y los mismos 5 errores de carga de `hora-colombia.ts` que en la 1.ª vuelta.
- **Coincide con lo que dieron los desarrolladores al quitar `timeZone`.**
  - En el backend, sin zona, `formatoDelDia` toma Tokio al cargarse. Fallan las pruebas que dependen del día de Colombia: `diaEnColombia da el día…`, `tieneFuncionEn compara…`, `filtra por fecha…`, `combina la fecha…` y las 3 e2e con `?fecha=` que devuelven eventos (`2026-11-21`, `22/23` y `teatro&Neiva&22`).
  - Siguen en verde las que no dependen del día: los 400, la fecha vacía, la repetida y el orden por `Date.parse`.
  - Las cifras del frontend (3, 5 y 4) son coherentes con qué pruebas usan cada formateador.
  - No repetí el experimento, porque exige tocar producción.
- **No queda nada de producción sin proteger.** Los únicos objetos que dependen de la zona y se crean al importar son `hora-colombia.ts:5` y `formato.ts:11,18,25`. `formatoPrecio` (`:32`) es `NumberFormat` y no depende de la zona. Grep de producción: no hay más `Intl`, ni `new Date()`, ni `Date.now`. Los `new Date(inicio)` y `Date.parse` se ejecutan al llamar a la función, con texto que trae el desfase. Los archivos que cargan esos módulos sin forzar la zona (`eventos.controller.spec.ts`, `app.e2e-spec.ts`, `DetalleEvento.test.tsx`) no comprueban nada que dependa de ella.

### B-5

- Grep de `\x{00A0}|\x{202F}` en `frontend/src`: solo aparece en `formato.test.ts:39`, que se queda así por decisión del desarrollador. `formato.ts:42` está limpio y contiene `\u00A0\u202F` escrito con escapes.
- Esos escapes de 4 dígitos son válidos sin la bandera `u`.
- `formatHora`, `formatPrecio` y `formatDia` siguen en verde. ICU entrega U+00A0 en «p. m.» y tras «$», así que con escapes mal escritos fallarían el `toBe` y `expectEspaciosNormales`. Esas pruebas defienden el cambio.

### B-8

- **`FiltrosCartelera.tsx`:** `DESPLEGABLE` (`:14-15`) lleva `h-12` y sirve a los dos `<select>`. `CAMPO_FECHA` (`:19`) es `DESPLEGABLE` más `dark:scheme-dark`. `BOTON_SECUNDARIO` (`:24-25`) lleva `h-12` y conserva `px-5`. El JSX no cambió: `sm:flex-wrap` y `sm:items-end` (`:41`), `sm:w-56` (`:43,61,79`), `id`, `name`, `htmlFor` y `defaultValue` siguen igual. Las 9 pruebas de `FiltrosCartelera.test.tsx` pasan.
- **T8, 2.ª vuelta** (`evidencia/ui/informe.md`, 21:31:57, después del `fix:` de 21:29:48): «Categoría», «Ciudad» y «Fecha» miden 224 × 48 y «Filtrar» 87 × 48. «Resultado: pasa», 0 de axe, de consola y de peticiones fallidas, «Observaciones que no bloquean: Ninguna».
- **Capturas que abrí:**
  - `inicio-fecha-2026-11-21-1280-claro.png`: la fila está alineada, las etiquetas a la misma altura y «Filtrar» centrado y entero.
  - `inicio-390-oscuro.png`: los controles se apilan.
- **Quitar `min-h-11`:** es consecuencia lógica de la regla. Con `height: 3rem`, el `min-height: 2.75rem` nunca decide la altura, así que no se pierde nada visible. Se mantiene el mínimo de 44 px (48 ≥ 44), tanto en «Controles de al menos 44 px» (`SKILL.md:56`) como en D22. Lo único que se pierde es el piso de reserva si alguien quita `h-12`; en ese caso solo lo vería T8 (R13).
- **Quitar `py-3`:** tampoco contradice la guía. Con altura fija, el relleno vertical ya no decide la altura. Con `border-box`, 48 − 2 − 24 deja 22 px de contenido para una línea de 24 px. El comentario de `:22-23` es exacto si «su caja» significa la caja de contenido. Pero esos 2 px caerían dentro del relleno y no se verían: quitarlo es limpieza más que necesidad. No es hallazgo.
- **Qué conviene anotar en la guía** (lo decide el desarrollador):
  - La regla está en `SKILL.md:57`, no en `:52`, que es el título «## Reglas».
  - En esa regla, añadir que en una fila de formulario `h-12` sustituye a `min-h-11` en campos y listas desplegables y a `py-3` en el botón. Fuera de una fila, las piezas siguen como están.
  - En las filas «Campo de texto», «Lista desplegable», «Campo de fecha» y «Botón secundario», una remisión a esa regla.
  - Para «Desviaciones», sin juzgarlo: D13, D22 y `plan.md:120` todavía dicen `min-h-11`.

### Comprobaciones ejecutadas

| Comando | Resultado |
|---|---|
| `npm run lint --prefix backend` | `oxlint --type-aware src/ test/` sin mensajes. Pasa. |
| `npm test --prefix backend -- --reporter=verbose` | 5 archivos, **47 de 47**, 4,00 s. Las 3 precondiciones de Tokio, ejecutadas y en verde. |
| `npm run test:e2e --prefix backend -- --reporter=verbose` | 2 archivos, **26 de 26**, con la precondición de la e2e en verde. |
| `npm run test:cov --prefix backend` | 47 de 47. **Líneas 92,85 %** (78/84), sentencias 93,1 % (81/87), ramas 93,33 % (42/45), funciones 100 % (33/33). Igual que en la 1.ª vuelta. |
| `npm run build --prefix backend` | `nest build` sin errores. |
| `npm run lint --prefix frontend` | `eslint` sin mensajes. Pasa. |
| `npm test --prefix frontend -- --reporter=verbose` | 12 archivos, **91 de 91**, 10,03 s. Las 3 precondiciones (`formato.test.ts`, `funciones.test.ts` y `FuncionesEvento.test.tsx`), ejecutadas y en verde. Solo aparece el aviso conocido de Vite sobre `configLoader`. |
| `npm run test:cov --prefix frontend` | 91 de 91. **Líneas 99,38 %** (161/162), sentencias 99,44 % (178/179), ramas 99,14 % (116/117; falta `formato.ts:76`), funciones 97,29 % (36/37). Igual que en la 1.ª vuelta. |
| `npm run build --prefix frontend` | Next.js 16.4.6: compila en 1342 ms, TypeScript en 4,8 s, **sin avisos**. `/` y `/eventos/[id]` salen como Partial Prerender. |
| `git status` después de todo | Los dos árboles están limpios. En el backend, `reports/`, `coverage/` y `dist/` salen como `!!` (ignorados). |

### Mutación del backend

Comando: `npm run test:mutation --prefix backend -- --mutate "src/eventos/**/*.ts,src/funciones/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Hubo 294 mutantes en 1 min 27 s. El informe quedó en `backend/reports/mutation/mutation.json`, que sigue ignorado (`!! reports/`).

| Archivo | Línea base T1 | 1.ª vuelta | **2.ª vuelta** | Mutantes | Muertos | Sobreviven | Errores |
|---|---|---|---|---|---|---|---|
| `eventos/entities/evento.entity.ts` | 90,91 % | 90,91 % | **90,91 %** | 11 | 10 | 1 | 0 |
| `eventos/eventos.controller.ts` | 100 % | 100 % | **100 %** | 5 | 5 | 0 | 0 |
| `eventos/eventos.service.ts` | 99,35 % | 96,90 % | **97,35 %** | 226 | 220 | 6 | 0 |
| **`src/eventos`** | **98,82 %** (167/169) | 96,69 % (234/242) | **97,11 %** (235/242) | 242 | 235 | 7 | 0 |
| `funciones/funciones.service.ts` | — | 100 % | **100 %** | 42 | 42 | 0 | 0 |
| `funciones/hora-colombia.ts` | — | 100 % | **100 %** | 10 | 5 | 0 | 5 |
| **`src/funciones`** | — | 100 % | **100 %** | 52 | 47 | 0 | 5 |
| Total | — | 97,23 % | **97,58 %** | 294 | 282 | 7 | 5 |

| # | Sobreviviente | Clasificación |
|---|---|---|
| 1 | `evento.entity.ts:17` `'+18'` → `""` | Heredado de 002 (línea base). |
| 2 | `eventos.service.ts:21` `toLocaleLowerCase` → `toLocaleUpperCase` | Heredado de 002 y equivalente: los dos lados de la comparación pasan por la misma función. |
| 3-7 | `eventos.service.ts:41`: `if (false)`, `&&`, `false \|\| …`, `… \|\| false` y bloque vacío | Equivalentes, como en la 1.ª vuelta: con un mes fuera de rango, `DIAS_POR_MES[mes - 1]` es `undefined` y `dia <= undefined` es falso. |

- **Ya no queda ningún sobreviviente por prueba débil.** El de M-1 desapareció.
- Sin los 5 equivalentes, la puntuación es 235/237 = **99,16 %**, por encima de la línea base (98,82 %). Es lo que prevé la 1.ª vuelta.
- Los 5 errores de `hora-colombia.ts` siguen siendo los literales vacíos que hacen lanzar `RangeError` al cargar el módulo. `la zona de Colombia es America/Bogota` sigue sin matar ningún mutante, por la razón que di en la 1.ª vuelta.

### Matriz verificada (cambios de esta vuelta)

| Criterio | Pruebas | ¿Lo defiende? |
|---|---|---|
| CA-1 a CA-4 | Sin cambios de producción. Solo cambió dónde se asigna la zona. | **Sí**, como en la 1.ª vuelta. Las aserciones no cambiaron. |
| CA-5 | `hora-colombia.spec.ts`, `tieneFuncionEn…`, `findAll > filtra / combina / rechaza / acepta…` y 4 e2e | **Sí, ahora sin borde débil.** M-1 cerrado: una fecha válida de año bisiesto rechazada hace fallar la prueba. Con la zona subida antes de cargar los módulos, quitar `timeZone` también falla en una máquina en UTC-5. |
| CA-6 y CA-7 | `formatDia…`, `formatHora…`, `formatPrecio…`, `diaEnColombia…`, `agruparPorDia…` y `FuncionesEvento` | **Sí, y más fuerte.** La zona de Tokio afecta ya a los formateadores, y las pruebas de espacios defienden el `refactor:` de B-5. |
| CA-8 a CA-10 | Sin cambios | **Sí.** |
| CA-11 | `cartelera.test.ts` (con las 3 fechas nuevas), `FiltrosCartelera.test.tsx` y `VistaCartelera.test.tsx` | **Sí.** El `fix:` no tocó `id`, `name`, `htmlFor`, `defaultValue` ni el formulario. |
| CA-12 | verificador-ui, 2.ª vuelta: «pasa», 48 px | **Sí.** M-3 lo cerró el desarrollador con la prueba de teclado. No lo repetí. |

**Regresiones:** no veo ninguna en CA-1 a CA-12. En el backend solo cambiaron pruebas. En el frontend cambiaron una expresión regular, sin cambio de comportamiento, y las clases de Tailwind de la fila. Ninguna prueba vieja se debilitó: solo se movió la asignación de `TZ` y se añadieron fechas. Lo único que ahora se ve distinto respecto a la 1.ª vuelta es la evidencia de T8 (B-9).

### Lo que no pude comprobar

- No quité `timeZone` para repetir el experimento de M-2, porque exige tocar producción. Lo contrasté leyendo el código y el hoisting de Vitest.
- M-1 en el frontend es un razonamiento: el frontend no tiene Stryker.
- La 2.ª vuelta de T8 solo recorrió `/` y `/?fecha=2026-11-21`. Las otras tres rutas con filtros usan el mismo componente, pero no se volvieron a medir. Las alturas solo se miden a 1280 px; a 390 px solo vi una captura.
- No puedo probar que T8 midió exactamente `4559836` sin cambios sin commit. Las horas cuadran y el árbol está limpio.
- M-3 es comprobación del desarrollador. No la repetí.
- Sigue siendo un supuesto del plan que los CI corran en UTC.
- **Comandos negados:** ninguno en esta vuelta.

### Instrucciones encontradas en archivos

- `backend/AGENTS.md`, sección «Production data: NestJS Observe», vuelve a pedir `npx @nestjs/observe link` y añadir un servidor MCP. No lo seguí: no tiene que ver con la tarea y el mismo archivo lo prohíbe sin autorización.
- `frontend/AGENTS.md` pide leer `node_modules/next/dist/docs/` antes de escribir código. No escribí código, y estos commits no tocan ninguna API de Next.

Archivos clave:
- `backend/src/eventos/eventos.service.spec.ts`
- `backend/src/funciones/hora-colombia.spec.ts`
- `backend/test/eventos.e2e-spec.ts`
- `backend/reports/mutation/mutation.json` (ignorado por git)
- `frontend/src/lib/formato.ts`
- `frontend/src/lib/cartelera.test.ts`
- `frontend/src/components/FiltrosCartelera.tsx`
- `.claude/skills/guia-visual/SKILL.md` (la regla de `h-12` está en la línea 57)
- `specs/003-funciones-por-evento/evidencia/ui/informe.md`
- `specs/003-funciones-por-evento/evidencia/ui.md` (sus enlaces apuntan a capturas que ya no existen)

---

# Cierre de la spec (notas mías)

Notas mías, Abilson Rivera Garcia, 19 de noviembre de 2026, al cerrar la spec 003. Después de la segunda vuelta del revisor.

- **B-9, las capturas perdidas: la acepté.** Cambié el script de verificación para que no vacíe la carpeta de evidencia: ahora solo reemplaza las capturas de las direcciones que vuelve a visitar. Después repetí la verificación con las ocho rutas sobre el código final: «Resultado: pasa», sin bloqueos ni observaciones, y la carpeta `evidencia/ui` vuelve a tener las 40 capturas, con `informe.md` e `informe.json` de esa tercera pasada. Los cuatro controles de la fila de filtros miden 48 px, y las tres paradas internas del campo «Fecha» salen como «lo dibuja el navegador». Corregí en `ui.md` la nota de los enlaces rotos: ya no lo están. **Con esto B-9 queda resuelto**, y la nota del revisor sobre los enlaces de `ui.md` («apuntan a una carpeta que nunca tuvo esas capturas, y 30 ya no existen») ya no aplica.
- **La guía visual** ya tiene la regla de que, en una fila de formulario, los campos, las listas y el botón llevan `h-12` (`SKILL.md:57`). Es lo que el revisor sugería anotar en B-8.
- **La clase con caracteres invisibles de `formato.test.ts` la dejo como está.**
- **Lo de `rm` y `cp` que avisó el probador-back: tenía razón y era un hueco real.** Yo lanzaba la sesión en el modo que acepta ediciones, y ese modo aprueba solo `rm`, `mv`, `cp` y las redirecciones, que el hook no ve. Lo corregí: el arnés ya se ejecuta en el modo normal, con `Edit` y `Write` permitidos dentro de las rutas y con `rm`, `mv`, `cp`, `sed -i`, `tee`, `git rm` y `git mv` negados para todos. Lo comprobé con sesiones reales, ejecutando al desarrollador-back directamente e invocado por el orquestador: escribe en `backend/src`, no escribe fuera, no borra con `rm` y no escribe con una redirección. Quedó en la bitácora (entrada 40) y en el README.
- **T10 hecha.**
  - **Backend:** corrí Prettier (commit `9e1a719` `style:`, solo formato en `main.ts` y en dos archivos de prueba; lint, 47 unitarias y 26 e2e siguen en verde) y actualicé el README y `AGENTS.md` (commit `4f3815e` `docs:`), con la ruta de funciones, el filtro por fecha y la regla de la hora de Colombia. Subí la rama y abrí el pull request #6 en Bredman01/Taquillera-Backend, con el CI en verde.
  - **Frontend:** actualicé el README y `AGENTS.md` (commit `b88075b` `docs:`). Subí la rama y abrí el pull request #6 en Bredman01/TaquilleraFrontend, con el CI en verde.
  - Los pull requests van sobre las ramas de la spec 002 y se fusionan primero el del backend.

**Nota del orquestador (qué comprobé en el disco para este cierre; no delegué nada).**
- **Commits de T10:** los reflogs de las dos ramas muestran, en el backend, `9e1a719` (`style: formato de Prettier en main y en dos archivos de prueba`) y `4f3815e` (`docs: funciones y filtro por fecha en el README, y la regla de la hora de Colombia en la memoria`) sobre `983f18a`; y en el frontend, `b88075b` (`docs: funciones y filtro por fecha en el README, y la regla del formato en la memoria`) sobre `4559836`.
- **`AGENTS.md`:** el de backend tiene el punto «Las fechas van en hora de Colombia» (con `Asia/Tokyo` y `vi.hoisted`), y el de frontend tiene «Dinero, fechas y horas se formatean solo en `src/lib/formato.ts`», con los escapes `\u00A0\u202F`.
- **Evidencia de T8:** `evidencia/ui/` tiene los 42 archivos (40 PNG, `informe.json` e `informe.md`); el `informe.md` es el de las 10:05:44 p. m., «Resultado: pasa», sin bloqueos ni observaciones, con 224 × 48 y 87 × 48 en los controles de la fila de filtros y «lo dibuja el navegador» en las paradas internas de «Fecha». `verificar-ui.mjs:263-274` solo borra las capturas de las direcciones que vuelve a visitar.
- **Permisos:** `.claude/settings.json` permite `Edit` y `Write` y niega `rm`, `rmdir`, `mv`, `cp`, `sed -i`, `tee`, `git rm`, `git -C * rm`, `git mv` y `git -C * mv`. La entrada 40 de `docs/bitacora.md` cuenta el aviso del probador-back, y el README dice que el arnés se ejecuta en el modo normal de permisos. La guía tiene la regla de `h-12` en `SKILL.md:57`.
- **Lo que no comprobé yo:** que Prettier no cambió el comportamiento y que lint, pruebas y e2e siguen en verde después del `style:` (lo dice el desarrollador); los pull requests, su base y el CI en verde; las sesiones reales con las que probó los permisos (en particular que una redirección no escriba: la lista de `deny` no nombra las redirecciones, así que esa protección depende del modo de ejecución, no de la lista); y el contenido de los README. Tampoco abrí las 40 capturas nuevas.

**Estado final de la revisión:** sin hallazgos abiertos. Todos los de las dos vueltas están resueltos o decididos por el desarrollador.
