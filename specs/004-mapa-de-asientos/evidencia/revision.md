# Revisión · 004 Mapa de asientos (T10)

*Informe del agente `revisor`, guardado completo por el orquestador. Primera revisión de la spec 004 (no es una segunda vuelta). Backend en `feat/004-mapa-de-asientos` (punta `df90c94`) y frontend en `feat/004-mapa-de-asientos` (punta `41897c7`); base del diff: `feat/003-funciones-por-evento`.*

## 1. Veredicto

**Aprueba con observaciones.** Nada bloquea el pull request.

| Gravedad | Cuántos |
|---|---|
| Crítico | 0 |
| Alto | 0 |
| Medio | 0 |
| Bajo | 7 (B1 a B7) |

Lint, pruebas, e2e y cobertura pasan en los dos lados, ejecutados por el revisor. El orden TDD es correcto y los mensajes son de una sola línea. La mutación da 100 % (93 mutantes, ninguno sobrevive). Los 11 criterios tienen prueba y cada prueba fallaría si se borra el código que cumple su criterio. Todos los puntos del Grep de D23 dan lo esperado.

## 2. Commits

**Backend** (`git -C backend log feat/003-funciones-por-evento..HEAD --format="%h %an %s%n%b"`):
```
df90c94 Abilson Rivera feat: función por id y asientos de cada función en la API

28432b1 Abilson Rivera test: pruebas de la función por id y de sus asientos en la API
```
**Frontend** (el mismo comando):
```
41897c7 Abilson Rivera fix: sin cambio de fondo en «Continuar» deshabilitado y mensaje de error de la API de funciones
c22ebb1 Abilson Rivera feat: página de la función con el mapa de asientos, la selección y el total
1531fa9 Abilson Rivera test: pruebas del mapa de asientos, la selección y el total
f188a83 Abilson Rivera feat: cabecera de la función y carga de la función y sus asientos
26e82e4 Abilson Rivera test: pruebas de la cabecera de la función y de su carga desde la API
```
- **Orden:** en el backend, `test:` y después `feat:`. En el frontend, `test:` → `feat:` → `test:` → `feat:` → `fix:`. Es lo que espera el encargo.
- **Cuerpo de los mensajes:** todos están vacíos; cada mensaje es una sola línea.
- **Contenido de cada commit** (`--name-status`):
  - Los `test:` solo traen archivos de prueba: en el backend `*.spec.ts` y `test/funciones.e2e-spec.ts`; en el frontend `*.test.ts(x)`.
  - Los `feat:` y el `fix:` no tocan ninguna prueba.
- **`git status`:** los dos árboles están limpios, en `feat/004-mapa-de-asientos`.

## 3. Comandos de control

Los ejecutó de uno en uno, en este orden.

| Comando | Resultado |
|---|---|
| `npm run lint --prefix backend` | `oxlint --type-aware src/ test/`, sin salida y sin error: sin hallazgos |
| `npm test --prefix backend` | **7 archivos y 61 pruebas pasan** |
| `npm run test:e2e --prefix backend` | **3 archivos y 35 pruebas pasan** (26 de antes y 9 nuevas) |
| `npm run lint --prefix frontend` | `eslint`, sin salida y sin error: sin hallazgos |
| `npm test --prefix frontend` | **16 archivos y 137 pruebas pasan**. Sale el aviso de Vite de que `vitest.config.ts` carga ESM como CommonJS; viene de antes (O22) |
| `npm test --prefix backend -- --reporter=verbose src/funciones src/asientos` (añadido) | 4 archivos y 25 pruebas pasan, con sus nombres |
| `npm test --prefix frontend -- --reporter=verbose` sobre `DetalleFuncion`, `AsientosFuncion` y `funciones.test.ts` (añadido) | 3 archivos y 36 pruebas pasan, con sus nombres |
| `npm run test:cov --prefix backend` (lo pide el rol del revisor) | 61 pruebas. Líneas 92,85 %, sentencias 93,1 %, ramas 90,56 %, funciones 100 %. `src/asientos` tiene 90,9 % de líneas; solo queda sin cubrir `asientos.module.ts` |
| `npm run test:cov --prefix frontend` (lo pide el rol del revisor) | 137 pruebas. Líneas 99,6 %, sentencias 99,64 %, ramas 98,32 %, funciones 98,38 %. Ramas sin cubrir: `MapaAsientos.tsx:70` (el motivo «ocupado» no llega, porque el botón está `disabled`) y `mapa.ts:22` (el `0` de `comparar`, porque las filas son claves de un `Map`). Las dos son ramas a las que no se llega; no son hallazgos |

**Builds:** no los repitió. No vio motivo: lint, pruebas y cobertura están en verde y los árboles no cambiaron desde los commits. Las cifras del build son de los agentes (T2, T5, T7, paso 12).

**Precondición de zona (Asia/Tokyo).** «las pruebas corren en Asia/Tokyo, fuera de la zona de Colombia» se ejecutó y pasó en:
- `frontend/src/components/DetalleFuncion.test.tsx`, nueva en 004;
- `frontend/src/components/AsientosFuncion.test.tsx`, nueva en 004;
- `frontend/src/lib/funciones.test.ts` y `backend/src/funciones/funciones.service.spec.ts`, que vienen de 003 y esta spec amplía;
- `backend/src/funciones/hora-colombia.spec.ts` (de 003).

No hay ningún `.skip`, `.only` ni `.todo` (Grep del punto 8 de D23, más abajo), y vitest no informa ninguna prueba omitida.

## 4. Mutación

**Comando, ejecutado una sola vez:**
```
npm run test:mutation --prefix backend -- --mutate "src/funciones/**/*.ts,src/asientos/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"
```

- Stryker mutó 7 archivos con 93 mutantes y corrió 57 pruebas en la pasada inicial. Avisa de 12 mutantes estáticos; en T1 eran 6.
- Terminó en 25 s.
- El informe está en `backend/reports/mutation/mutation.json`. El revisor lo leyó con Grep y no lo editó.

| Archivo | Puntuación | Matados | Sobreviven | Sin cobertura | Timeout | Errores |
|---|---|---|---|---|---|---|
| **Todos** | **100 %** | 88 | 0 | 0 | 0 | 5 |
| `asientos/entities/asiento.entity.ts` | 100 % | 6 | 0 | 0 | 0 | 0 |
| `asientos/asientos.controller.ts` | 100 % | 2 | 0 | 0 | 0 | 0 |
| `asientos/asientos.service.ts` | 100 % | 22 | 0 | 0 | 0 | 0 |
| `funciones/funciones.service.ts` | 100 % | 53 | 0 | 0 | 0 | 0 |
| `funciones/hora-colombia.ts` | 100 % | 5 | 0 | 0 | 0 | 5 |

`funcion-con-evento.entity.ts` y `funcion.entity.ts` son interfaces: no generan mutantes.

**`src/funciones` frente a la línea base de T1:** sigue en 100 %, igual que la línea base.

| | Mutantes | `funciones.service.ts` | `hora-colombia.ts` |
|---|---|---|---|
| T1 | 52 | 42 matados | 5 matados y 5 errores |
| Ahora | 63 | 53 matados | 5 matados y 5 errores, sin cambios |

Los 11 mutantes más son los de `findOne`, y todos mueren. Por ejemplo:
- `f.id !== id` lo mata la comparación con la función 5;
- `if (false)` lo mata el mensaje exacto «El evento undefined no existe»;
- el mensaje vacío («``») lo mata la regex `^La función 9999 no existe$`.

**Clasificación de sobrevivientes y sin cobertura:** no hay ninguno, en ningún archivo.
- **Decoradores y `ParseIntPipe`:** Stryker no genera mutantes para los argumentos de los decoradores. El controlador solo tiene 2 mutantes, los `BlockStatement` de sus dos métodos, y los matan las pruebas unitarias del controlador. Así que `@Controller('funciones')`, `@Get(':id')`, `@Get(':id/asientos')` y `ParseIntPipe` quedan fuera de la mutación y solo los defiende la e2e. El revisor lo comprobó leyendo y corriendo la e2e:
  - sin `ParseIntPipe`, `id` llega como texto, `f.id === '5'` es falso y `/funciones/5` responde 404: falla la prueba del 200;
  - con `abc` daría 404 en lugar de 400: fallan las dos pruebas de 400;
  - con otra ruta, fallan las pruebas del 200.
- Las pruebas «propaga la NotFoundException» quedan como «covered» sin matar ningún mutante. Es lo esperado: la propagación no tiene código que mutar. Su valor es fallar si alguien añade un `try/catch`.

## 5. Matriz criterio → prueba

El revisor comparó con Grep y leyendo los archivos que cada nombre de la matriz existe tal cual, en el archivo indicado. Las rutas son relativas al repositorio de cada lado.

| Criterio | Prueba presente | ¿La defiende? | Motivo / lo que falta |
|---|---|---|---|
| CA-1 | Sí: las 2 de `findOne`, las 2 de `findFuncion`, las 2 del controlador, las 4 e2e y las 2 de `getFuncion` | **Sí** | La e2e compara el cuerpo exacto y las claves ordenadas del 200, los 404 completos (9999, 0 y -1) y el 400 del pipe. Ningún mutante de `findOne` sobrevive. Sin la rama 404/400, `getFuncion` daría `error` y registraría: la prueba falla |
| CA-2 | Sí: 3 de servicio, 2 del controlador, 3 e2e y `getAsientos pide…` | **Sí** | El plano de 40 ids está escrito a mano en la prueba, sin `FILAS` ni `ASIENTOS_POR_FILA`. Los seis ocupados se comparan con la lista exacta. Mutación al 100 % |
| CA-3 | Sí: `muestra el título, el día, la hora…` | **Sí** | Corre en Tokio (la precondición pasa). Incluye el caso `inicio` en UTC, que da «11:30 p. m.» del sábado. Con la hora local fallaría: el probador lo vio en T4 |
| CA-4 | Sí: las 4 (`agruparPorFila…`, escenario, cinco filas de ocho, nombres) | **Sí** | La entrada de la unitaria lleva el número 10 junto al 2. Los nombres son exactos y hay 40 botones. El escenario va antes de los grupos (`compareDocumentPosition`) |
| CA-5 | Sí: unitaria y componente | **Sí** | Sin el `disabled`, falla `toBeDisabled`. Sin la guarda de `alternarAsiento`, falla la unitaria (en jsdom el clic sobre un `disabled` no llega). Las señales que no son color solo se ven en el navegador: T11 comprobaciones 29 y 31 (`dashed / line-through` en los dos temas, «pasa») |
| CA-6 | Sí: unitaria y componente | **Sí** | `pressed: true/false` con el mismo nombre. Sin `aria-pressed`, el filtro `pressed:false` no encuentra el botón. Espacio y Enter, en T11 («pasa») |
| CA-7 | Sí: las 3 | **Sí** | Sin la multiplicación, el total no da «$ 50.000» ni «$ 24.000». Sin `role="status"`, `getByRole("status")` lanza. La lista va en el orden del mapa |
| CA-8 | Sí: unitaria y componente | **Sí** | Con un tope de 7, B1 queda pulsado y fallan `boton("B1", false)` y `pulsados()` 6. `MAXIMO_POR_COMPRA` debe ser 6. El aviso exacto, como `alert` |
| CA-9 | Sí: las 3 | **Sí** | El `href` exacto `/funciones/5/compra?asientos=A1,A2`. Un id con `&` o `#` sale codificado y la coma no. Sin asientos hay un botón deshabilitado y ningún enlace. En la barra de direcciones aparece `%2C` (desviación aceptada, O25) |
| CA-10 | Sí: las 7 filas (1 a 7) | **Sí** | Siete ids inválidos sin llamar a `fetch`. Más de 20 cuerpos inválidos. 403, 500 y 503. El corte a 5 s con la señal exacta. La composición (el único `alert` dentro de la región). En el navegador: T9, «pasa», con las cuatro rutas con `role="alert"` sin backend |
| CA-11 | Evidencia del navegador y respaldo en Vitest | **Sí** | `evidencia/ui.md` «Resultado: pasa», con 35, 41, 1 y 4 paradas, 44 × 44 y sin observaciones. `evidencia/interaccion.md` «Resultado: pasa», 37 de 37. Respaldo: la prueba 4 de CA-4 y la 2 de CA-5 |

- **Pruebas sin criterio:** están todas las que lista el plan, con su nombre. En el backend, las 3 unitarias y las 2 e2e. En el frontend, las 2 de no modificar la entrada, las 4 de `DetalleFuncion`, la de `AsientosFuncion` y las 2 de `MapaAsientos`.
- **Pruebas sin fila en el plan:** `getFuncion acepta un inicio con cualquier desfase válido` y `getAsientos devuelve la lista tal como llega aunque no tenga 40 asientos` (ver B7).
- **Pruebas débiles:** no encontró ninguna.
  - Los `toBeTruthy()` aplican una máscara de bits a `compareDocumentPosition`: es una aserción real.
  - Cada `errorSpy.toHaveBeenCalled()` va junto al resultado exacto.
  - Las pruebas del controlador miran también el valor que devuelve, no solo que se llamó al doble.

## 6. Comprobaciones puntuales de T10

**Grep de D23** (con la herramienta Grep):

| Punto | Resultado |
|---|---|
| 1 `Intl\.\|toLocale` en `frontend/src` | Solo `lib/formato.ts:11,18,25,32,75` y `lib/cartelera.ts:24` (la excepción heredada) |
| 2 `new Date\(\)\|Date\.now\(` en `backend/src` y `frontend/src` | Ninguna coincidencia |
| 3 `use client` en `frontend/src` | Solo `components/MapaAsientos.tsx:1` |
| 4 `prefetch=\{false\}` en `frontend/src` | Solo `components/MapaAsientos.tsx:168` |
| 5 `fetch\(` en `frontend/src/components` | Ninguna coincidencia |
| 6 `@/lib/funciones` y `@/lib/eventos` en `MapaAsientos.tsx` y `lib/mapa.ts` | Solo `import type { Asiento }` (`MapaAsientos.tsx:6` y `mapa.ts:1`). `@/lib/eventos` no aparece |
| 7 `forwardRef` en `backend/src` | Ninguna coincidencia |
| 8 `\.only\(\|\.skip\(\|\.todo\(\|TEMPORAL\|SONDA` en `backend/src`, `backend/test` y `frontend/src` | Ninguna coincidencia |
| 9 `frontend/src/app/funciones/[id]/compra` | «Path does not exist». `app/funciones/[id]/page.tsx` sí existe |

**Grafo de módulos:**
- `asientos.module.ts` lleva `imports: [EventosModule, FuncionesModule]`, sin `exports`.
- `eventos.module.ts` importa `FuncionesModule` y exporta `EventosService`.
- `funciones.module.ts` exporta `FuncionesService` y no tiene controlador.
- `AsientosModule` solo aparece en `app.module.ts:4,9`. No hay `forwardRef`.
- `AsientosService` recibe `FuncionesService` y `EventosService` importados como valor.

El grafo es el de D1.

**`app/funciones/[id]/page.tsx`:**
- `FuncionPage` no es asíncrona y envuelve `FuncionCargada` en `<Suspense>` con «Cargando función…».
- `FuncionCargada` espera `params` y `getFuncion(id)`.
- Solo con `resultado.ok`, el `mapa` recibe otro `<Suspense>` («Cargando asientos…») con `AsientosCargados`. Si no, `undefined`.
- `AsientosCargados` espera `getAsientos(funcionId)`.
- No hay `Promise.all`, `generateMetadata` ni `notFound()`.

Cumple D10.

**Frontera de cliente:**
- `MapaAsientos.tsx` es el único archivo con `'use client'`. De `lib/funciones.ts` solo importa el tipo `Asiento`.
- `lib/mapa.ts` no lleva `'use client'` y también importa solo tipos.
- `AsientosFuncion.tsx` y `DetalleFuncion.tsx` son síncronos y de servidor.

**Lo que no se tocó** (`--stat` de los dos lados):
- Backend: 11 archivos, todos de la lista del plan. Ni `src/eventos/**`, ni configuración, ni `package.json`.
- Frontend: 13 archivos, todos de la lista. Ni `formato.ts`, `vitest.config.ts`, `next.config.ts`, `package.json` ni `FuncionesEvento.test.tsx`.
- Ningún archivo `.env*`, temporal ni de más.

**Coincidencia con las decisiones:** D2 a D7 y D10 a D20 coinciden con el código. Las clases de los asientos, la fila, el escenario y «Continuar» coinciden con `guia-visual/SKILL.md:36-38,46-50`.

## 7. Hallazgos

| Id | Gravedad | Archivo:línea | Qué pasa | Por qué importa | Rol y corrección |
|---|---|---|---|---|---|
| B1 | Bajo | `frontend/src/lib/mapa.ts:42,45` | `agruparPorFila` usa `Array.prototype.toSorted`. Como `MapaAsientos` es de cliente, es el primer `toSorted` que llega al navegador (`funciones.ts:229` solo corre en el servidor). Next 16 declara soporte desde Firefox 111 (`next/dist/docs/03-architecture/supported-browsers.md:8-19`) y solo inyecta polyfills como `fetch`, `URL` y `Object.assign` (`:25-29`). | **Supuesto, no probado en un navegador:** `toSorted` existe desde Firefox 115, así que en Firefox 111 a 114 el mapa lanzaría al pintarse. Hoy el impacto es casi nulo. | desarrollador-front, si el desarrollador lo quiere: `[...lista].sort(...)` en `lib/mapa.ts`. La prueba `agruparPorFila no modifica la lista que recibe` ya cubre el cambio. Se puede aceptar tal cual. |
| B2 | Bajo | `backend/src/asientos/asientos.service.ts:23-27` | Ninguna prueba fija lo que hace `findFuncion` cuando una función apunta a un evento que no existe (D7: 404 «El evento … no existe»). La prueba `cada función de ejemplo pertenece a un evento que existe` fija los datos, no ese comportamiento. | Con los datos de ejemplo no se puede provocar, y la propagación es implícita, sin código que mutar. Si alguien añadiera un `catch` que devuelva un título vacío, nada fallaría. | probador-back, en una spec futura que cambie datos (005): una unitaria con un `EventosService` cuyo `findOne` lance. Contradice la preferencia de D9 por los servicios reales, así que antes lo decide el planificador. No hace falta para este PR. |
| B3 | Bajo | `frontend/src/lib/eventos.ts:63` y `frontend/src/lib/funciones.ts:62` | `ESPERA_MAXIMA_MS = 5000` sigue repetida. | Es deuda heredada de 003 (O11) y 004 no la agrava: las funciones nuevas usan la constante que ya existía. Hay dos fuentes para la misma regla. | desarrollador-front, en una spec de mantenimiento: exportarla desde `eventos.ts`, igual que `ID_VALIDO`. |
| B4 | Bajo | `frontend/src/components/MapaAsientos.tsx:70-72,121-128` | Con el aviso del máximo ya visible, un segundo intento fallido no cambia el DOM. El lector de pantalla no anuncia nada, y el botón tampoco cambia (`aria-pressed` sigue en `false`). | D16 lo decidió así y la prueba lo fija («Otro intento fallido… el aviso sigue»). Quien usa un lector de pantalla y vuelve a pulsar un asiento no recibe respuesta. | planificador, si se quiere en una spec futura: volver a montar el aviso en cada intento, por ejemplo con una `key` que cambie. Si no, se deja. |
| B5 | Bajo | `frontend/src/components/MapaAsientos.tsx:20,23` | Hallazgo H1 del verificador: en tema oscuro, el borde discontinuo de los ocupados casi no se ve (`dark:border-zinc-600` con `disabled:opacity-50`). | CA-5 se cumple igual: el número tachado (en los dos temas, T11 comprobación 31), «ocupado» en el nombre, `disabled` y el cursor. WCAG exime del contraste a los controles inactivos. | Lo decide el desarrollador humano. Si lo quiere más marcado, se cambia primero la fila «Asiento ocupado» de la guía (lo hace él) y después el desarrollador-front. |
| B6 | Bajo | `frontend/src/components/DetalleFuncion.tsx:28-33,51-54` | Hallazgo H2 del verificador: en `funciones/9999` solo hay el enlace de arriba y el `h1`. | CA-10 y la regla `SKILL.md:60` se cumplen. Es el patrón de D13 y del detalle del evento. Es una mejora de experiencia, no un defecto. | Lo decide el desarrollador humano. Opcional: repetir «Volver a la cartelera» debajo del mensaje. |
| B7 | Bajo | `specs/004-mapa-de-asientos/plan.md:692-694` y `:445-462` | La sección «Desviaciones» del plan sigue vacía, y hay que llenarla al cerrar (regla de `.claude/rules/specs.md`). Las candidatas de O19 (a-h) son la zona en `AsientosFuncion.test.tsx`, el `--amend`, el orden de las claves, el `fix:` `41897c7`, el paso 17 con `%2C`, T11 antes de T8 y la estructura del mapa. Las dos pruebas sin fila deben pasar a «Pruebas sin criterio» (regla de `pruebas.md`: toda prueba defiende una fila o una decisión). | Sin esto, la documentación no refleja lo que se implementó. | El orquestador, antes de T12. Las decisiones del desarrollador, en primera persona y con sus palabras. |

**Opinión del revisor sobre lo que se dejó para revisar (punto 7 del encargo):**
- **Decoradores y `ParseIntPipe` solo en la e2e; sin prueba del 404 del evento.** Lo primero no es un hallazgo. La e2e es el tipo correcto de prueba, Stryker ni siquiera los muta, y comprobó leyendo que sin el pipe o con otra ruta fallan las pruebas del 200 y del 400. Lo segundo es B2.
- **`ESPERA_MAXIMA_MS` repetida y `ID_VALIDO` exportado.** Lo primero es B3. Exportar `ID_VALIDO` es correcto: es D11, hay una sola fuente y `funciones.ts:2` la importa sin copiarla.
- **Orden de las claves del JSON de `GET /funciones/:id`.** Sale `id, eventoId, inicio, precio, titulo, ciudad, lugar`. No es un problema: en JSON el orden de los miembros no tiene significado, y las pruebas comparan con `toEqual` y con las claves ordenadas. Solo el ejemplo del plan las escribe en otro orden; se anota en Desviaciones (B7).
- **Validación de tipos sin enteros positivos ni filas A a E.** Coincide con D11 y con el contrato, que solo piden tipos. Los casos que no se validan solo pasan si el backend miente, y o quedan en la forma («asiento 1.5») o terminan en el aviso (un `id` decimal da 400 en los asientos). No es un hallazgo. Conviene validar los ids de verdad en 005, en el servidor, cuando se compren.
- **Prettier del backend no verificado.** El revisor tampoco lo pudo ejecutar sin `npm exec`. Revisión manual con `.prettierrc` (comillas simples y coma final): las únicas líneas de más de 80 columnas en `src/asientos` y `test/funciones.e2e-spec.ts` son títulos de `it(...)`, que Prettier no parte. **Supuesto:** el bloque `asientos.service.spec.ts:180-184` quedaría en exactamente 80 columnas en una sola línea, y Prettier podría unirlo. Es cosmético y el CI no ejecuta Prettier. Recomienda que el desarrollador humano pase `npm run format --prefix backend` antes del PR si quiere confirmarlo.
- **Lo que T6 no vio fallar a nivel de componente.** El revisor no pudo ejecutar mutantes a mano (no edita), pero leyendo las pruebas, las cuatro fallarían:
  - **tope de 7:** fallan `boton("B1", false)` y `pulsados()` con 6;
  - **sin `status`:** `getByRole("status")` lanza en 5 pruebas;
  - **aviso sin `role="alert"`:** `getByRole("alert")` lanza; y si pasara a `status`, habría dos `status` y también lanza;
  - **total sin multiplicar:** fallan «$ 0» al cargar, «$ 50.000» y «$ 24.000».

  No es un hallazgo.
- **`AsientosFuncion.test.tsx` fuerza `Asia/Tokyo`.** Es correcto: la prueba de composición compara el día y la hora, y la precondición pasa. Es una desviación de D8 ya aprobada; solo falta anotarla (B7).
- **H1 y H2 del verificador:** B5 y B6. No bloquean.
- **«Continuar» deshabilitado sin cambio al pasar el puntero (`41897c7`).** Comprobado en `MapaAsientos.tsx:28-32,161,169`: el botón lleva `enabled:hover:` y el enlace `hover:`, como `SKILL.md:36`. Sin prueba porque las pruebas no miran clases, que es lo correcto. Mezcla dos cambios en un mismo commit, pero así lo pidió el desarrollador.
- **`%2C` en la barra de direcciones.** CA-9 se cumple: el `href` lleva la coma literal (prueba de componente y T11 comprobación 21). La barra de direcciones es cosa de Next. Lo importante va para 005: leer `asientos` ya decodificado desde `searchParams` (es una Promise en Next 16) y partirlo por comas. Hay que anotarlo en Desviaciones (B7).

## 8. Lo que no pudo comprobar y comandos negados

- **Comandos negados:** ninguno. Añadió tres comandos que el encargo no listaba y no se negaron: los dos `--reporter=verbose` y `test:cov` en los dos lados (lo pide su rol).
- **Sin ejecutar:** `npm run build` en los dos lados (lo dice el encargo y no vio motivo) y Prettier (`npm exec` pide aprobación).
- **Supuesto, no verificado:**
  - que `toSorted` no exista en Firefox 111 a 114 y que Next no le ponga polyfill (B1). Se apoya en la documentación instalada de Next y en datos de compatibilidad, no en un navegador;
  - el caso límite de Prettier en `asientos.service.spec.ts:180-184`.
- **Tomado de la evidencia de otros, sin repetirlo:** T8 (`evidencia/contrato.md`: «coincide»), T9 (`evidencia/ui.md`: «Resultado: pasa», H1 a H3) y T11 (`evidencia/interaccion.md`: «Resultado: pasa», 37 filas «pasa», contadas con Grep). No volvió a levantar servidores.
- **Instrucción ajena al encargo:** `backend/AGENTS.md:77-85` («Production data: NestJS Observe») invita a ejecutar `npx @nestjs/observe link` y `claude mcp add observe …`. No es parte de esta spec ni de este diff, y el mismo archivo prohíbe hacerlo sin autorización (`:75`). No lo hizo.
- **Archivos generados por el revisor:** Stryker reescribió `backend/reports/mutation/mutation.json`, que es la salida normal del comando y no la editó. `git -C backend status` seguía limpio antes de la mutación; no lo repitió después y supone que `reports/` está en `.gitignore`.

---

# Mis decisiones sobre los hallazgos

Las tomé el 19 de noviembre de 2026, con el cierre de los tres controles a la vista.

| # | Hallazgo | Decisión | Mi motivo | Estado |
|---|---|---|---|---|
| B1 | `toSorted` en `lib/mapa.ts` es el primer método reciente que llega al navegador | **Descartado** | Lo soportan los navegadores que Next 16 declara. | Cerrado, sin cambios |
| B2 | Ninguna prueba fija el 404 del evento dentro de la búsqueda de una función | **Aplazado a la spec 005** | Con los datos de ejemplo no se puede provocar, y la 005 vuelve a tocar ese servicio. | Abierto; lo recoge el plan de la 005 |
| B3 | `ESPERA_MAXIMA_MS` repetida en dos archivos | **Descartado** | Viene de la spec 003 y no cambia el comportamiento. | Cerrado, sin cambios |
| B4 | Con el aviso del tope ya visible, un segundo intento no se vuelve a anunciar | **Descartado por ahora** | El aviso se anuncia la primera vez. Mejorarlo queda para después. | Cerrado por ahora |
| B5 / H1 | En tema oscuro el borde discontinuo de los ocupados se ve poco | **Descartado** | El ocupado se distingue por el número tachado, por su nombre y porque no recibe el foco. Mi recorrido midió el borde y el tachado en los dos temas. | Cerrado, sin cambios |
| B6 / H2 | En una función inexistente la página queda con poco contenido | **Descartado** | Es el mismo patrón del detalle del evento. | Cerrado, sin cambios |
| H3 | A 1280 px queda un hueco a la derecha del mapa | **Descartado** | Es una observación de diseño que no afecta ningún criterio. | Cerrado, sin cambios |
| Formato | Un archivo de pruebas del backend sin pasar por Prettier | **Aceptado** | Lo corregí con `npm run format`. | Resuelto en `d32de7d` |

