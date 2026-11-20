# Contrato · 006 Boleta con código QR y validación

- **Control:** T14, `guardian-contrato` (solo lee).
- **Fecha:** 20 de noviembre de 2026.
- **Puntas revisadas:** backend `63c4373`, frontend `090fc66`.
- **Qué se le pidió:** comparar, campo por campo, lo que el backend responde (`GET /boletas/:codigo` y `POST /boletas/:codigo/ingreso`), lo que el frontend espera (`frontend/src/lib/`) y lo que acordó la sección «Contrato» de `plan.md`, incluido el enlace «Ver mi boleta» y el CORS del POST sin cabeceras.
- **Vuelta:** primera de este control.

El informe va tal como lo entregó el agente. Al final hay notas del orquestador, aparte.

---

## Resultado: coincide

Las tres fuentes (backend, frontend y plan) dicen lo mismo en las dos rutas nuevas. No hay filas de diferencia. Hay observaciones para el revisor, abajo.

Todas las rutas de archivo van desde la raíz `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\`. Lo leí en el disco; no ejecuté pruebas ni levanté servidores.

### Ruta por ruta

**`GET /boletas/:codigo`: coincide**
- Ruta y método: el frontend arma `GET ${API_URL}/boletas/${encodeURIComponent(codigo)}` (`frontend/src/lib/boletas.ts:142-145`). El backend tiene `@Controller('boletas')` + `@Get(':codigo')` (`backend/src/boletas/boletas.controller.ts:11-14`).
- Los nueve campos, con su tipo: `backend/src/boletas/entities/boleta.entity.ts:6-16`, armados en `backend/src/boletas/boletas.service.ts:30-41`. Son los mismos que en `frontend/src/lib/boletas.ts:6-23` y los que copia `leerBoleta` en `boletas.ts:87-129`. Coinciden con el plan (`plan.md:223-243`).
- `estado` solo vale `"valida"` o `"usada"` en los tres lados (`boleta.entity.ts:1`, `boletas.ts:4`, `boletas.ts:122-127`).
- `fechaUso` es `null` si es válida y un texto si está usada. El texto sale de `fechaHoraEnColombia`, que escribe `AAAA-MM-DDTHH:mm:ss-05:00` (`backend/src/funciones/hora-colombia.ts:47`).
- `inicio` es el mismo texto de la función (`backend/src/funciones/funciones.service.ts:12`, copiado tal cual en `boletas.service.ts:33`).
- `asientos` y `nombre` salen de la compra (`backend/src/compras/compras.service.ts:67` y `:129`, que recorta el nombre; luego `boletas.service.ts:36-37`).
- El correo, `total` y `funcionId` no salen: `boletas.service.ts:30-41`, y la e2e lo comprueba en `backend/test/boletas.e2e-spec.ts:166` y `:169`.
- El código va en mayúsculas en la respuesta: `boletas.service.ts:60` y `:66`.
- Errores: el 404 es `{statusCode, message: "La boleta {CODIGO} no existe", error: "Not Found"}` (`boletas.service.ts:14-20`, e2e `:87-91`). El frontend lo trata como `no-encontrada` sin registrar (`boletas.ts:148-150`). Cualquier otro estado o cuerpo inválido da `error` con `console.error` (`boletas.ts:151-159`, `:161-166`).

**`POST /boletas/:codigo/ingreso`: coincide**
- Ruta y método: `POST ${API_URL}/boletas/${encodeURIComponent(codigo)}/ingreso` (`frontend/src/lib/ingreso.ts:69`, `:72-73`). El backend tiene `@Post(':codigo/ingreso')` con `@HttpCode(200)` (`backend/src/boletas/boletas.controller.ts:18-19`). Responde 200 y no 201; lo fija `backend/test/boletas.e2e-spec.ts:261`.
- Sin cuerpo ni cabeceras propias: `ingreso.ts:72-75` solo pone `method` y `signal`.
- 200: el backend devuelve la boleta usada (`boletas.service.ts:93-95`). El frontend exige `estado === "usada"` y una fecha legible (`ingreso.ts:77-85`). Plan: `plan.md:255`.
- 409: el backend devuelve `{statusCode: 409, message: "La boleta {CODIGO} ya fue usada", error: "Conflict", fechaUso}` (`boletas.service.ts:83-90`). La fecha es la del primer uso y no cambia (`boletas.service.ts:94`). El frontend lee `fechaUso` (`ingreso.ts:87-94`). La e2e fija el cuerpo completo (`boletas.e2e-spec.ts:290-296`). Plan: `plan.md:256-260`.
- 404: el mismo cuerpo que en GET (`boletas.service.ts:77-80`). El frontend lo trata como `error` con registro (`ingreso.ts:96-97`).
- Sin 400: ni el controlador ni el servicio lo emiten, y el plan lo excluye (`plan.md:264`).

**CORS (`backend/src/main.ts:6-8`): coincide con el plan.** `origin` es `http://localhost:3000` por omisión. Con el POST sin cabeceras ni cuerpo, el frontend hace una petición simple. Ninguna prueba lo comprueba (ver observación 3).

**Tipo `Boleta` en los dos lados: coincide.** Mismos nombres, tipos y unión `valida`/`usada` (`boleta.entity.ts:1, 6-16` y `boletas.ts:4, 6-23`). Frontend: un solo tipo en `lib/`, y los componentes lo importan (`VistaBoleta.tsx:4`, `IngresoBoleta.tsx:4`).

**Enlace «Ver mi boleta»: coincide.**
- `CompraCreada` tiene los mismos cinco campos en los dos lados (`backend/src/compras/entities/compra.entity.ts:13-16` y `frontend/src/lib/compras.ts:14-20`).
- El código de compra es de 8 caracteres `A-Z` y `0-9` (`backend/src/compras/generador-codigo.ts:4-5`, `:13-15`). Así `rutaDeBoleta(compra.codigo)` (`frontend/src/components/FormularioCompra.tsx:151`) no cambia nada al codificarlo, y `findByCodigo` lo encuentra (`compras.service.ts:87-88`).
- `comprar` copia el `codigo` tal cual (`compras.ts:234-235`) y espera 201 (`compras.ts:225`). La e2e de la boleta también espera 201 en la compra (`boletas.e2e-spec.ts:142`).

**Textos que el frontend muestra: coinciden con «Textos exactos»** (`plan.md:345-367`):
- «Cargando boleta…» (`frontend/src/app/boletas/[codigo]/page.tsx:12`).
- «Volver a la cartelera», «Tu boleta», las etiquetas de la lista y la no encontrada (`VistaBoleta.tsx:35`, `:40`, `:44`, `:64-71`).
- Error de la boleta (`VistaBoleta.tsx:47`, `:52`).
- «Validar ingreso», «Validando ingreso…», «Ingreso validado.», y los dos textos del 409 (`IngresoBoleta.tsx:131`, `:141-143`, `:161`).
- Fallo de validación (`IngresoBoleta.tsx:147-149`).
- Encabezado (`ConsultarBoleta.tsx:70-72`, `:86`, `:91`).
- «Ver mi boleta» (`FormularioCompra.tsx:154`).

### Observaciones (no son diferencias)

1. **El frontend acepta fechas más laxas que el contrato.** `inicio` y `fechaUso` se aceptan con cualquier texto que `Date.parse` entienda (`boletas.ts:77-79`, `:104`, `:125`; `ingreso.ts:43-47`, `:79`, `:88`). El contrato escrito dice `AAAA-MM-DDTHH:mm:ss-05:00`. El backend siempre lo escribe así, pero las pruebas fijan la aceptación de otros desfases (`boletas.test.ts:480-483`; `ingreso.test.ts:157`). El plan lo dice así en D11, así que no es una diferencia, pero el texto del contrato se queda corto.
2. **El 200 del POST solo se valida en dos campos.** `validarIngreso` mira `estado` y `fechaUso` (`ingreso.ts:78-81`) y no los demás. Lo fija el plan (`plan.md:270-273`), pero es más laxo que el GET.
3. **Nada prueba las cabeceras CORS.** Ninguna e2e mira `Access-Control-Allow-Origin` en el POST ni en el 404 y el 409, que son las respuestas que el frontend lee. Que la lista de métodos del paquete `cors` incluya POST por omisión es un supuesto mío; no lo comprobé en `node_modules`.
4. **Un 404 que no es el de la boleta.** `backend/src/asientos/asientos.service.ts:35` llama a `funciones.findOne`, que lanza `La función N no existe` (`backend/src/funciones/funciones.service.ts:75`). Con los datos actuales no ocurre, porque toda compra apunta a una función existente, pero si ocurriera, la respuesta de GET y POST no sería la del contrato. El plan no lo menciona.
5. **El frontend no lee el `message` de los errores.** Los textos que muestra son suyos. Los del backend solo aparecen como datos de prueba (`boletas.test.ts:73`; `ingreso.test.ts:47`, `:57`).
6. **Dos «Estado» en la boleta.** Son el `h2` (`IngresoBoleta.tsx:105-107`) y el término de la lista (`IngresoBoleta.tsx:110`). Coinciden con el plan (`plan.md:354`) y es la desviación 5 del plan, que decide el verificador.

### Lo que no pude leer o comprobar

- No leí `specs/006-boleta-por-codigo/spec.md`, ni la matriz del plan (`plan.md:369-428`), ni las pruebas de componentes (`VistaBoleta.test.tsx`, `IngresoBoleta.test.tsx`, `ConsultarBoleta.test.tsx`), ni `boletas.service.spec.ts` y `boletas.controller.spec.ts`.
- No leí `backend/src/compras/compras.controller.ts`. El 201 de la compra sale de las pruebas y del frontend, no de la declaración del controlador.
- No leí `frontend/src/lib/funciones.ts` más allá de lo que mostró la búsqueda (`:14`, `:26`).
- No ejecuté ninguna prueba ni ningún servidor; todo es lectura.

---

## Notas del orquestador (no son del guardián)

- Las citas `plan.md:NNN` del guardián corresponden a la versión de `plan.md` que leyó; después de esta lectura no se editó el plan.
- **Observación 3 (CORS):** la cabecera `Access-Control-Allow-Origin: http://localhost:3000` en el POST la comprobó T4 con `curl` (200 y 409), y el recorrido T13 hizo el POST real desde Chrome con `localhost:3000` (pasos 22 a 29 de `interaccion.md`). No hay prueba automática: las e2e no ejecutan `main.ts` (D15 de 005).
- **Observación 4 (404 de la función):** la ruta que la dispararía es `BoletasService.findByCodigo`/`validar` → `AsientosService.findFuncion`, solo si existiera una compra con una función que ya no existe. Hoy las funciones no se borran.
- **Observación 6 (dos «Estado»):** es la que pedí que valoraran el verificador-ui y el revisor; queda para T15 y T16.
