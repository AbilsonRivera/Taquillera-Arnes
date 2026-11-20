# Contrato · 005 Compra con pago simulado

Informe del `guardian-contrato` (T10), guardado completo y sin editar. El agente solo lee: no ejecutó pruebas ni servidores. Veredicto: **`coincide`**.

---

## Informe T10: contrato de la compra (spec 005)

**Veredicto final: `coincide`.** No encontré diferencias que bloqueen el contrato. Quedan dos observaciones informativas, que el plan ya documenta, y una nota sobre el origen del texto del 409.

### (a) Puntas de rama

- Backend `feat/005-compra-pago-simulado`: `35ebbb170c88e6765320c067af21bac131180992`. Coincide con lo que esperaba el orquestador.
- Frontend `feat/005-compra-pago-simulado`: `5e4df84da0124ccebc01c6fd08e785b42eb08858`. Coincide.

Abreviaturas usadas abajo: **B** = `backend/` y **F** = `frontend/`.

### (b) Comparación por punto

**1. Ruta y método: coincide**
- Frontend: `comprar` arma `${API_URL}/funciones/${funcionId}/compras`, método `POST` y cabecera `Content-Type: application/json` (F `src/lib/compras.ts:210,214-216`).
- Backend: `@Controller('funciones')` (B `src/compras/compras.controller.ts:5`), `@Post(':id/compras')` (`:11`) y `ParseIntPipe` (`:13`). El 201 es el código por defecto de `@Post` (supuesto).
- `API_URL` vale `NEXT_PUBLIC_API_URL ?? "http://localhost:3001"` (F `src/lib/api.ts:9-10`). El puerto 3001 es el del backend (B `src/main.ts:9`).
- CORS: `origin: FRONTEND_URL ?? 'http://localhost:3000'` (B `src/main.ts:6-8`, origen en `:7`). El origen coincide con el puerto del frontend. `cors` acepta POST por defecto (B `node_modules/cors/lib/index.js:10`) y refleja `access-control-request-headers` si no se configuran (`:95-99`), así que `content-type` pasa.

**2. Petición: coincide**
- Frontend envía exactamente `asientos`, `nombre` y `correo`, con nombre y correo recortados (F `compras.ts:217-221`).
- Backend lee esos tres campos (B `compras.service.ts:89` para `asientos`, `:118` para `nombre`, `:126` para `correo`). No espera ningún campo que el frontend no mande, y no hay campos enviados que el backend ignore.

**3. 201: coincide**
- Backend devuelve cinco campos (B `compras.service.ts:75-81`). `CompraCreada` es el `Pick` de esos cinco (B `src/compras/entities/compra.entity.ts:13-16`).
- Frontend declara los mismos cinco, todos obligatorios, con los mismos tipos (F `compras.ts:14-20`). `esCompraCreada` valida tipos y `Date.parse` (`:162-176`).
- Frontend copia solo esos cinco campos al resultado (`compras.ts:232-240`) y no lee `nombre` ni `correo`, que el backend no devuelve.
- `fechaHoraEnColombia` escribe `AAAA-MM-DDTHH:mm:ss-05:00` (B `src/funciones/hora-colombia.ts:41-48`, desfase fijo en `:26`). Ese formato es ISO 8601 con desfase y `Date.parse` lo entiende. La prueba de `esCompraCreada` con fecha inválida está en `compras.test.ts` (caso «una fecha que no es una fecha»).
- Un 201 con campos de más no rompe nada: el frontend copia solo los cinco.

**4. 409: coincide**
- `ocupar` lanza `ConflictException` con `{statusCode, message, error:'Conflict', asientos}` (B `src/asientos/asientos.service.ts:77-82`). `noDisponibles` sale por `filter` sobre `ids`, así que conserva el orden pedido y solo incluye los ocupados (`:75`).
- Frontend lee únicamente el campo `asientos`, con validación de lista no vacía de textos (F `compras.ts:182-188`, uso en `:244-254`). Si falta, registra con `console.error` y devuelve los asientos pedidos (`:247`).
- El texto lo arma `FormularioCompra` a partir de la lista (F `src/components/FormularioCompra.tsx:159`): «Estos asientos ya no están disponibles: ` + join(", ")`. El frontend no lee `message`. El texto coincide con el del backend (B `asientos.service.ts:79`).
- Observación informativa: el texto está escrito en dos lugares (backend y `FormularioCompra`). Hoy coincide, pero si uno cambia, el otro no sigue.

**5. Reglas del cuerpo: coincide, con la diferencia documentada del correo vacío**

| # | Backend (B `compras.service.ts`) | Frontend (F `compras.ts` / `mapa.ts`) | Veredicto |
|---|---|---|---|
| 1 | `:90-91`, «La lista de asientos no es válida»; cuerpo no objeto o arreglo se trata como `{}` (`:28-30`, `:87`) | No hay mensaje. `prepararCompra` da `sin-asientos` si el parámetro no es texto (`:90`) | Coincide según la columna «En el frontend» del plan |
| 2 | `:93-95`, «Elige al menos un asiento» | `:92-98` da `sin-asientos` si el parámetro está vacío | Coincide |
| 3 | `:14`, `:96-100`, tope 6, mensaje interpolado | `mapa.ts:4` (6); `compras.ts:96` | Coincide |
| 4 | `:102-109`, «El asiento X está repetido»; nombra el primer id que ya había aparecido, de izquierda a derecha | `compras.ts:93,97` da `sin-asientos` sin nombrar el asiento | Coincide (el frontend no muestra el mensaje) |
| 5 | `:111-116`, «El asiento X no existe en el lugar» con `existeEnElPlano` (`asientos.service.ts:62-64`, plano en `asiento.entity.ts:4-5`) | `compras.ts:94,98` compara con la lista de `GET …/asientos` | Coincide (el plano es el mismo) |
| 6 | `:118-121`, «Escribe tu nombre completo» | `compras.ts:127-128`, mismo texto | Coincide |
| 7 | `:14-15,122-124`, tope 100, «El nombre admite máximo 100 caracteres» | `compras.ts:50,129-130`, mismo tope y texto | Coincide |
| 8 | `:16,18,126-129`; regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, tope 254, vacío y no válido dan «Escribe un correo electrónico válido» | `compras.ts:51,53,133-137`; regex idéntica y tope 254. Vacío da «Escribe tu correo electrónico» (`:134-135`) | Diferencia documentada en el plan (regla 8) |

- Orden: los dos lados validan las reglas 1 a 5 antes que la 6 a la 8. En el frontend, las 1 a 5 se resuelven en `prepararCompra`, antes de pintar el formulario.
- Repetidos (regla 4): el frontend no nombra el asiento, pero la regla no tiene mensaje en el frontend, así que no es una diferencia.

**6. Códigos de estado: coincide**

| Código | Backend | Frontend (`comprar`, `compras.ts`) |
|---|---|---|
| 201 | `compras.service.ts:75-81` | `:225-241`, `ok: true` si el cuerpo es válido; si no, `error` (`:227-229`) |
| 409 | `asientos.service.ts:77-82` | `:244-254`, `no-disponibles` |
| 400 (regla o pipe) | `compras.service.ts:20-26`; pipe en `compras.controller.ts:13` | `:256-257`, `error` |
| 404 | `funciones.service.ts:74-76` | `:256-257`, `error` |
| 500 | `compras.service.ts:143-147` | `:256-257`, `error` |
| Sin respuesta o más de 5 s | n/a | `:222` (`AbortSignal.timeout(ESPERA_MAXIMA_MS)`, `api.ts:13`) y `:258-261`, `error` |

- Ningún código lee `message` del backend. El único campo leído de un error es `asientos` del 409.

**7. Rutas de lectura previas: coincide**
- `getFuncion` (F `funciones.ts:154-183`) exige `id`, `eventoId`, `inicio`, `precio`, `titulo`, `ciudad` y `lugar`. El backend los devuelve (B `asientos.service.ts:34-38`, `funcion-con-evento.entity.ts:4-8`; `evento.entity.ts:22,25,26`).
- `getAsientos` (F `funciones.ts:194-219`) exige `id`, `fila`, `numero` y `estado` con valores `disponible` u `ocupado`. El backend los devuelve (B `asientos.service.ts:42-58`, `asiento.entity.ts:7-13`).
- `prepararCompra` solo usa `funcion.id`, `precio`, `titulo`, `lugar`, `inicio` y los `id` de asientos (F `compras.ts:87,108-110`; `CompraFuncion.tsx:105-110`).
- Ocupación única: `ocupar` escribe en el mismo `Set` (B `asientos.service.ts:73,89`) que lee `findAsientos` (`:44`). Lo que ocupa una compra es lo que muestra el mapa.
- Función inexistente: `findOne` lanza 404 (B `funciones.service.ts:74-76`), y `findFuncion` y `findAsientos` lo heredan.

**8. Tipos declarados una sola vez: coincide**
- `CompraCreada`, `ResultadoCompra` y `PaginaCompra` están en F `compras.ts:14-42`. `FormularioCompra.tsx:15-19` y `compras.test.ts` los importan, no los copian.
- `Funcion`, `FuncionConEvento` y `Asiento` están en F `funciones.ts:11,26,42`. `mapa.ts:1` los importa.
- Ningún componente declara una copia de un tipo de la API. Los `interface` y `type` que aparecen en `FormularioCompra.tsx:34` (`Estado`) son estado de la interfaz, no tipos de la API.
- Ningún componente lee un campo que el contrato no tenga.

**9. Textos: coincide en todos los de la sección «Textos exactos»**

| Texto del plan | Frontend | Veredicto |
|---|---|---|
| «Cargando compra…» | F `app/funciones/[id]/compra/page.tsx:15` | Coincide |
| «Volver a la cartelera» | F `CompraFuncion.tsx:36` | Coincide |
| `h1` «Tu compra» | F `CompraFuncion.tsx:42` | Coincide |
| `h2` «Resumen» y términos Evento, Día, Hora, Lugar, Asientos, Total | F `CompraFuncion.tsx:102,105-110` | Coincide |
| `h2` «Tus datos»; etiquetas «Nombre completo» y «Correo electrónico» | F `FormularioCompra.tsx:178,185,196` | Coincide |
| Errores de campo | F `compras.ts:128,130,135,137` | Coincide |
| «Pagar $ 30.000» y «Procesando pago…» | F `FormularioCompra.tsx:215` (`formatPrecio` en `formato.ts:58-60` normaliza los espacios) | Coincide |
| `h2` «¡Compra aprobada!»; «Código de la compra», «Asientos», «Total» | F `FormularioCompra.tsx:142,145-147` | Coincide |
| «Estos asientos ya no están disponibles: …» y «Elegir otros asientos» | F `FormularioCompra.tsx:159,165` | Coincide |
| «No pudimos procesar el pago. Revisa tu conexión e inténtalo de nuevo.» | F `FormularioCompra.tsx:205-206` (el salto de línea de JSX se vuelve un espacio) | Coincide |
| `h1` «Elige tus asientos primero» y «Ir al mapa de asientos» | F `CompraFuncion.tsx:57,63` | Coincide |
| `h1` «No encontramos esa función» | F `CompraFuncion.tsx:68` | Coincide |
| `h1` «No pudimos cargar la compra» y el aviso | F `CompraFuncion.tsx:71,76` | Coincide |

Los títulos y avisos también aparecen en `CompraFuncion.test.tsx` y `FormularioCompra.test.tsx`, con los mismos textos.

**10. Pruebas (R7): coinciden en límites y reglas**
- Límites: ambas suites aceptan 6 asientos y rechazan 7, aceptan 100 caracteres y rechazan 101, aceptan correo de 254 y rechazan 255. Backend en `compras.service.spec.ts` (bloques de CA-4 y «acepta seis asientos…»); frontend en `compras.test.ts` (`validarComprador` y `prepararCompra`).
- Correos: ambas aceptan `ñandú@correo.co`, `a@b.c` y espacios alrededor; ambas rechazan `ana@correo`, `@x.co` y dos arrobas.
- Único desacuerdo: correo vacío. Backend fija «Escribe un correo electrónico válido» (`compras.service.spec.ts`, caso «correo vacío»). Frontend fija «Escribe tu correo electrónico» (`compras.test.ts`, `CORREO_VACIO`). Es la diferencia documentada del plan.
- Backend prueba la regla 1 y el orden de las reglas. Frontend no los prueba porque en su lado no hay mensaje para ellos; el plan no lo exige.
- Las dos suites no fijan mensajes distintos para ningún otro caso.

**11. Otras fuentes**
- `ESPERA_MAXIMA_MS = 5000` solo está en F `api.ts:13`. `funciones.ts` y `eventos.ts` la importan y no tienen copia.
- `MAXIMO_POR_COMPRA` es 6 en el frontend (`mapa.ts:4`) y en el backend (B `compras.service.ts:14`). Es la duplicación que el plan describe.
- `formatDia`, `formatHora` y `diaEnColombia` tienen su versión en el frontend (`formato.ts`) y el backend (`hora-colombia.ts`). Son lógica de presentación en dos repos, no un tipo de la API.
- `IDS_DEL_PLANO` en el backend se arma con `FILAS` y `ASIENTOS_POR_FILA`. La e2e (`test/compras.e2e-spec.ts:21-27`) escribe los 40 ids a mano; es la comprobación esperada.
- Frontend: `CompraFuncion.tsx:116-125` y `FormularioCompra.tsx:277-286` tienen el mismo componente `Dato`, y la cadena de clases del enlace se repite. El plan lo acepta en la desviación 4.
- `funciones.ts:3` sigue importando un valor (`ID_VALIDO`) de `eventos.ts`. El plan dice que la razón de D13 era compras, no funciones, así que no es un problema del contrato.
- Búsqueda de `prefetch` en `frontend/src`: sin resultados. «Continuar» ya no lleva `prefetch={false}`, como pide D17.

### (c) Diferencias

**Bloquean el contrato:** ninguna.

**Informativas**

| # | Diferencia | Gravedad | Quién lo corregiría |
|---|---|---|---|
| I1 | Correo vacío: frontend «Escribe tu correo electrónico» (F `compras.ts:135`); backend «Escribe un correo electrónico válido» (B `compras.service.ts:127-128`) | Informativa. Está en la tabla de reglas del plan | Ninguno. Ya documentada |
| I2 | El texto del 409 está escrito en el backend (B `asientos.service.ts:79`) y en el frontend (F `FormularioCompra.tsx:159`) | Informativa. Hoy coincide | Ninguno ahora. Si cambia uno, el otro sigue igual |
| I3 | Un cuerpo que no es objeto o es arreglo se trata como `{}` y da la regla 1 (B `compras.service.ts:28-30,87`). El frontend nunca manda ese caso | Informativa | Ninguno |
| I4 | `Dato` y la clase del enlace se repiten en dos componentes (F `CompraFuncion.tsx:116-125`, `FormularioCompra.tsx:277-286`) | Informativa. Lo acepta la desviación 4 del plan | Ninguno, o el desarrollador-front si se quiere unificar |
| I5 | `funciones.ts:3` importa `ID_VALIDO` de `eventos.ts` | Informativa. Fuera del contrato | El plan, si quiere cerrarlo |

### (d) Veredicto final

**`coincide`.** Las cuatro rutas y cinco campos de la compra, los tres campos del cuerpo, el 409, los textos y las reglas coinciden entre backend, frontend y plan. La única diferencia de mensaje (correo vacío) está documentada en el plan.

### (e) Lo que no pude verificar

- No ejecuté ninguna prueba ni el servidor, como pedía la tarea. Lo que afirmo sale de leer el código y las aserciones.
- No pude ver el diff de `main.ts` frente a la rama de la spec 004 (solo tengo Read, Grep y Glob, sin git). Leí su contenido actual: CORS con origen `FRONTEND_URL` o `http://localhost:3000`.
- No revisé en `node_modules` el cuerpo que Nest da al pipe (`Validation failed (numeric string is expected)`) ni el 201 por defecto de `@Post`. Ambos son supuestos del plan y los fijan las e2e, que no ejecuté.
- No leí completos `CompraFuncion.test.tsx` y `FormularioCompra.test.tsx`; solo busqué los textos con Grep.
- No comprobé si `getFuncion` y `getAsientos` cambiaron en esta rama. Solo confirmé que su forma actual coincide con lo que responde el backend.
- No revisé `herramientas/recorridos/005-compra.mjs`, la evidencia de T12 ni el comportamiento en el navegador, que quedan fuera de T10.
- No abrí ningún archivo `.env*`.
