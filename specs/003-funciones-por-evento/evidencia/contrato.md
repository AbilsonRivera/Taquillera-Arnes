# Contrato · 003 Funciones por evento

Informe del `guardian-contrato` (T7), copiado completo por el orquestador. Solo lee: no ejecutó código. Las ramas son `feat/003-funciones-por-evento` en los dos repositorios (backend `6017bd6`, frontend `3f7cdea`).

**Nota del orquestador sobre el resultado.** El guardián encontró **una diferencia (D-1)** que es una contradicción **dentro del plan**, no entre los dos lados. No se delegó ninguna corrección: el propio informe dice que primero hay que decidir cuál de los dos textos del plan manda, y eso lo decide el desarrollador (la sección «Contrato» es la fuente de verdad según `.claude/rules/contrato.md`). Queda como hallazgo bajo, con recomendación, en el cierre. **La regla de fecha válida coincide en los dos repositorios**, que era lo que pidió el desarrollador comprobar.

---

## Informe T7 · guardian-contrato · 003-funciones-por-evento

**Veredicto: no coincide del todo, aunque lo que cruza los dos lados sí coincide.** Las rutas, los nombres, los tipos, los códigos de estado, la regla de fecha y el día en Colombia son iguales en backend, frontend y plan. Quedan **una diferencia de validación** del frontend frente a la sección «Contrato» y **una contradicción dentro del plan**, más observaciones que no son diferencias.

Método: lectura de archivos y búsquedas con Grep. No ejecuté código, pruebas, `tsc` ni `Intl`. Las rutas van relativas a `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\`.

### Diferencias

| # | Ruta | Campo o aspecto | Backend | Frontend | Plan | Qué lado corregir |
|---|---|---|---|---|---|---|
| D-1 | `GET /eventos/:id/funciones` | Valores permitidos de `id`, `eventoId` y `precio` | Siempre envía enteros positivos (`backend/src/funciones/funciones.service.ts:8-69`) | `frontend/src/lib/funciones.ts:41-43` solo exige `typeof === "number"`, sin entero ni `>= 1` / `> 0` | La tabla «Contrato» (`plan.md:155-158`) dice «Entero ≥ 1» y «Entero > 0». D9 (`plan.md:43`) dice «numéricos». Se contradicen | Primero hay que corregir el plan para decidir cuál manda. La sección «Contrato» es la fuente de verdad (`.claude/rules/contrato.md:12`), así que, con esa tabla, el frontend debería validar enteros. Riesgo bajo: el backend no envía otra cosa |

### Observaciones (no son diferencias con los datos reales)

- **O-1, `inicio` sin desfase.** `esFuncion` acepta cualquier cosa que `Date.parse` entienda (`funciones.ts:45`). Eso incluye `"2026-11-21"` (JS la toma como medianoche UTC, que en Colombia es el día 20 a las 7:00 p. m.) y `"2026-11-21T16:00:00"` (JS la toma como hora local del navegador). El contrato exige ISO con desfase (`plan.md:157`). El plan (D9, y la instrucción de incluir «cualquier valor que Date.parse entienda») lo permite de forma explícita; conviene que el planificador lo confirme. El backend nunca envía eso.
- **O-2, `getEventos` no valida.** La garantía de que el frontend nunca manda una fecha inválida, vacía o repetida está en `leerFiltros` (`cartelera.ts:82-83`). `getEventos` (`eventos.ts:76-80`) manda lo que reciba. En los archivos que leí, su único llamador es `cargarCartelera` (`cartelera.ts:100`). No busqué otros llamadores.
- **O-3, citas del plan desfasadas.** Son líneas del código de 002, así que ya no coinciden: D13 cita `FiltrosCartelera.tsx:30` para `sm:flex-wrap` y está en `:37`; D13 cita `VistaCartelera.tsx:34` para la `key` y está en `:37`; D12 cita `eventos.ts:76-78` y está en `:78-80`; D2 cita `eventos.service.ts:174` para el 404 y está en `:211`. Solo documentación.
- **O-4, salida de `Intl` sin ejecutar.** `formato.ts:42` contiene la clase `[  ]`. La búsqueda confirma que contiene al menos uno de los dos caracteres especiales (U+00A0 o U+202F); no comprobé cada uno por separado. Las formas de `formatDia`, `formatHora` y `formatPrecio` quedan como supuesto R2 del plan.

### Tabla campo por campo de `Funcion`

| Campo | Backend (entidad) | Frontend (tipo y validación) | Plan (contrato) | ¿Coincide? |
|---|---|---|---|---|
| `id` | `number` obligatorio, `backend/src/funciones/entities/funcion.entity.ts:2` | `number`, `frontend/src/lib/funciones.ts:11`; validación `:41` | `number`, «Entero ≥ 1» (`plan.md:155`) | Tipo y obligatoriedad sí; valores no (D-1) |
| `eventoId` | `number`, `funcion.entity.ts:3` | `number`, `funciones.ts:12`; validación `:42` | `number`, «El `:id` de la ruta» (`plan.md:156`) | Sí (el valor sale de la ruta, `funciones.service.ts:74`) |
| `inicio` | `string`, `funcion.entity.ts:6` (comentario `:4-5`) | `string`, `funciones.ts:13`; validación `:44-45` | `string` ISO 8601 con desfase (`plan.md:157`) | Sí en tipo; O-1 |
| `precio` | `number`, `funcion.entity.ts:8` | `number`, `funciones.ts:14`; validación `:43` | `number`, «Entero > 0» (`plan.md:158`) | Tipo sí; valores no (D-1) |

Campos de más: ninguno. `findByEvento` devuelve copias de las cuatro claves (`funciones.service.ts:73-78`). La e2e fija las claves exactas (`backend/test/eventos.e2e-spec.ts:349-356`) y la unitaria también (`backend/src/funciones/funciones.service.spec.ts:90-95`). El frontend no lee nada que el backend no envíe.

### Ruta, método y códigos

- **URL y método.** El frontend pide `${API_URL}/eventos/${eventoId}/funciones` con GET por defecto (`frontend/src/lib/funciones.ts:61,64`). El backend lo declara con `@Controller('eventos')` (`backend/src/eventos/eventos.controller.ts:6`) y `@Get(':id/funciones')` (`:30`). `ciudades` (`:20`) es un solo segmento y `:id` (`:25`) también, así que no hay choque. `/eventos/ciudades/funciones` daría 400 por `ParseIntPipe`, que es lo esperado.
- **200.** Arreglo ordenado por `Date.parse` (`funciones.service.ts:75-76`). Cuerpo exacto en `eventos.e2e-spec.ts:329-348`, con `[]` en `:359-366`. El frontend acepta `[]` como `ok` (`funciones.ts:76`, prueba `funciones.test.ts:149-160`).
- **404.** El backend responde `{ statusCode: 404, message: "El evento {id} no existe", error: "Not Found" }` (`eventos.service.ts:211`, `findFunciones` en `:223-224`). La e2e fija el cuerpo completo para 9999 (`eventos.e2e-spec.ts:368-378`) y para 0 y -1 (`:380-392`). El frontend trata `!res.ok` como `{ ok: false }` sin leer el cuerpo (`funciones.ts:67-70`). Lo prueban `funciones.test.ts:170-203`.
- **400.** `ParseIntPipe` responde `{ statusCode: 400, message: "Validation failed (numeric string is expected)", error: "Bad Request" }`. La e2e fija el cuerpo para `abc` y `1.5` (`eventos.e2e-spec.ts:394-404`). El frontend no llama con esos valores: `getEvento` filtra con `ID_VALIDO` (`frontend/src/lib/eventos.ts:66,150-152`). Si llegara, sería `{ ok: false }`.
- **Otros.** Un 200 sin arreglo, un elemento inválido o un corte a los 5 s dan `{ ok: false }` (`funciones.ts:71-82`, espera en `:31,65`). Lo cubren `funciones.test.ts:205-281`.
- **Orden de la lista.** El backend ordena (`funciones.service.ts:75-76`). El frontend también reordena con `agruparPorDia` (`funciones.ts:91-93`) sobre una copia. No depende de otro orden.

### `GET /eventos?fecha=`

**Nombre, formato y posición.**
- Backend: `@Query('fecha')` (`backend/src/eventos/eventos.controller.ts:14`), pasado en `findAll({ categoria, ciudad, fecha })` (`:16`). `FiltrosEventos.fecha` (`eventos.service.ts:14`).
- Frontend: `Filtros.fecha` (`frontend/src/lib/eventos.ts:44`). `getEventos` escribe `fecha` después de `categoria` y `ciudad` (`eventos.ts:78-80`).
- Coinciden el nombre y el orden. El backend no depende del orden de la consulta.

**Comparación de la regla de fecha, línea a línea.**

| Elemento | Backend (`backend/src/eventos/eventos.service.ts`) | Frontend (`frontend/src/lib/cartelera.ts`) | Igual |
|---|---|---|---|
| Expresión regular | `:23` `/^(\d{4})-(\d{2})-(\d{2})$/` | `:28` misma | Sí |
| Días por mes | `:25` `[31,28,31,30,31,30,31,31,30,31,30,31]` | `:30` misma | Sí |
| Bisiesto | `:28-29` | `:33-35` misma fórmula | Sí |
| Validación | `:33-46`: `exec`, mes 1-12, último día, día 1..último | `:42-53`: mismos pasos | Sí |
| Sin `trim` | Sí (`:32`) | Sí (`:39`) | Sí |

**Evaluación a mano.** Con las dos implementaciones idénticas, el resultado es el mismo en ambos lados. Lo evalué a mano; no ejecuté nada.

| Entrada | Backend | Frontend | Motivo |
|---|---|---|---|
| `2026-11-21` | válida | válida | Día 21 ≤ 30 |
| `2026-02-28` | válida | válida | 2026 no es bisiesto; último día 28 |
| `2026-02-29` | no válida | no válida | 2026 no es bisiesto |
| `2028-02-29` | válida | válida | Divisible por 4 y no por 100 |
| `2000-02-29` | válida | válida | Divisible por 400 |
| `1900-02-29` | no válida | no válida | Divisible por 100 y no por 400 |
| `2100-02-29` | no válida | no válida | Ídem |
| `2026-04-31` | no válida | no válida | Abril tiene 30 días |
| `2026-11-31` | no válida | no válida | Noviembre tiene 30 días |
| `2026-13-01` | no válida | no válida | Mes > 12 |
| `2026-00-10` | no válida | no válida | Mes < 1 |
| `2026-11-00` | no válida | no válida | Día < 1 |
| `2026-11-32` | no válida | no válida | Día > 30 |
| `2026-1-5` | no válida | no válida | La expresión exige dos cifras |
| `20261-11-21` | no válida | no válida | No encaja el patrón |
| `2026/11/21` | no válida | no válida | Separador incorrecto |
| `21-11-2026` | no válida | no válida | Orden incorrecto |
| ` 2026-11-21` | no válida | no válida | `^` no admite espacio al principio |
| `2026-11-21 ` | no válida | no válida | `$` sin bandera `m` solo casa al final |
| `2026-11-21T00:00` | no válida | no válida | Sobra la hora |
| `""` | sin filtro (`eventos.service.ts:232`) | «Todas» (`cartelera.ts:82-83`, no entra) | Vacía no es inválida, es ausencia |
| `mañana` | no válida | no válida | No encaja el patrón |

No hay ninguna entrada que un lado acepte y el otro rechace.

**Casos que no son texto válido.**
- Backend: los arreglos dan 400 «Cada filtro admite un solo valor» (`eventos.service.ts:229-231`); la fecha inválida da 400 «La fecha {valor} no es válida» (`:190-191`); la vacía no filtra (`:232`). Las comprueban `eventos.e2e-spec.ts:219-251` y `eventos.service.spec.ts:419-523`.
- Frontend: un arreglo, una vacía o una inválida se convierten en «Todas», porque `typeof fecha === "string" && esFechaValida(fecha)` (`cartelera.ts:82-83`). No llega a la URL (`cartelera.test.ts:335-382`).
- **Conclusión.** Por esa regla, el frontend no provoca 400 de `/eventos` con estos parámetros. La categoría (`cartelera.ts:72-73`) solo entra si está en `CATEGORIAS`. La ciudad solo entra si está en la lista del backend (`cartelera.ts:75-80`), y una ciudad desconocida devuelve `[]` sin 400 (`eventos.service.ts:199-201`). Ningún filtro se manda como arreglo.

**`GET /eventos` y `GET /eventos/:id` siguen con nueve campos.**
- Backend: `Evento` tiene nueve campos (`backend/src/eventos/entities/evento.entity.ts:20-30`).
- Frontend: `Evento` tiene los mismos nueve (`frontend/src/lib/eventos.ts:28-38`).
- La e2e fija las nueve claves (`eventos.e2e-spec.ts:7-17,65-89,273`).
- El plan dice que no cambian (`plan.md:279`).

**Nombres de los filtros.** `FiltrosEventos` (`eventos.service.ts:11-15`) y `Filtros` (`eventos.ts:41-45`) usan `categoria`, `ciudad` y `fecha`. Coinciden.

**Día en hora de Colombia.**
- Backend: `diaEnColombia` (`backend/src/funciones/hora-colombia.ts:14-21`) usa `Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', year, month: '2-digit', day: '2-digit' })` y lee las partes por tipo.
- Frontend: `diaEnColombia` (`frontend/src/lib/formato.ts:25-30,73-78`) usa `Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', year, month: '2-digit', day: '2-digit' })` y también lee las partes por tipo.
- Mismo método, mismas partes, mismo relleno de dos cifras. Solo cambia el locale, que no afecta porque se lee por tipo. Deberían dar el mismo `AAAA-MM-DD`; no lo ejecuté.
- Ningún lado usa la zona local. La búsqueda de `getDate`, `getHours`, `new Date()`, `Date.now`, `toISOString` y `toLocale` en `backend/src` no encontró nada de producción; solo aparece `getHours()` en las precondiciones de las pruebas. En `frontend/src` solo aparece `toLocaleLowerCase("es")` en `cartelera.ts:24`, que no es de fechas.
- Los demás formateos de fecha (`formatDia`, `formatHora`, `formato.ts:11-23,63-70`) también fijan `timeZone`.

### Pruebas que fijan la forma real

- **e2e (`backend/test/eventos.e2e-spec.ts`).** Fija lo que pide el plan: las claves exactas de funciones (`:349-356`), el arreglo exacto (`:329-348`), `[]` (`:359-366`), y los cuerpos completos de 404 (`:291-295,373-377,386-390`), del pipe (`:314-318,398-402`), de fecha (`:225-229`) y de repetido (`:246-250`). Y para `GET /eventos?fecha=2026-11-21` compara la lista completa (`:172-181`).
- **Unitarias del backend.** `eventos.service.spec.ts:419-474` cubre el rechazo de la lista de fechas (formato, calendario, bisiestos) con el mensaje exacto. `:476-492` cubre las válidas. `:494-506` cubre la vacía y `:508-523` la repetida. `funciones.service.spec.ts:61-83` cubre el orden. `hora-colombia.spec.ts:29-66` cubre los casos de zona.
- **Frontend.** `funciones.test.ts` fija `/eventos/4/funciones`, `/eventos/6/funciones` y `/eventos/10/funciones` (`:134,145,155-157`). El 404 usa el mismo texto del backend, «El evento 9999 no existe» (`:179-186`). `eventos.test.ts:251-253,268-271` fija `?categoria=teatro&ciudad=Bogot%C3%A1&fecha=2026-11-21`. `cartelera.test.ts:69-96` fija las listas de fechas válidas y no válidas, idénticas a las de la evaluación a mano.
- **Cambio D8.** `FiltrosCartelera.test.tsx:145` espera `categoria=teatro&ciudad=Neiva&fecha=` (sin `fecha` no había ese sufijo). `VistaCartelera`, `FuncionesEvento.test.tsx` y `DetalleEvento.test.tsx` no los leí completos; grep confirma los textos del plan (`FuncionesEvento.test.tsx:70,82,85,91,173,184`; `DetalleEvento.test.tsx:186,223`).
- **Textos.** «Funciones», «Cargando funciones…», «No hay funciones programadas», «No pudimos cargar las funciones. Intenta de nuevo en unos minutos.» y el nombre del enlace aparecen igual en el plan, en el código (`frontend/src/components/FuncionesEvento.tsx:22,30,58`; `frontend/src/app/eventos/[id]/page.tsx:60`) y en las pruebas.

### Textos que cruzan los dos lados

- «El evento {id} no existe»: backend `eventos.service.ts:211`; e2e y unitarias lo fijan. El frontend no lo lee. Sin contradicción.
- «La fecha {valor} no es válida»: backend `eventos.service.ts:191`; e2e en `:225-229`. El frontend no lo lee. Sin contradicción.
- «Cada filtro admite un solo valor»: backend `eventos.service.ts:230`; e2e en `:156-160,246-250`. El frontend no lo lee. Sin contradicción.

### Lo que no pude comprobar

- No ejecuté nada: ni las pruebas, ni la e2e, ni `tsc`, ni `Intl` en Node o en el navegador. La salida real de `formatDia`, `formatHora` y `formatPrecio` (espacios, «p. m.», agrupación) sigue siendo un supuesto (R2).
- No pude ver el historial de git ni las ramas. Solo comparé el contenido de los archivos.
- La precondición de la zona (`getHours()` = 12) solo se puede comprobar al ejecutar.
- El mensaje exacto de `ParseIntPipe` lo tomé de la e2e de 002. No verifiqué la versión de Nest.
- No leí completos `FuncionesEvento.test.tsx`, `DetalleEvento.test.tsx` ni `VistaCartelera.test.tsx`.

### Instrucciones encontradas en archivos

No encontré en el código, los tests ni el plan ninguna instrucción dirigida al agente. Los archivos traen texto normal de documentación, y el plan trae el encargo del orquestador.
