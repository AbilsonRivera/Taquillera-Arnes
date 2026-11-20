# Spec 006 · Boleta con código QR y validación, con teclado

- **Fecha:** 20/11/2026, 6:26:48 a. m.
- **Cómo:** prueba automática en Chrome, a 1280 px y a 390 px, con Tab y Enter. Compra y valida de verdad contra el backend recién iniciado. El código QR se lee de una captura de la pantalla con jsqr, no con la cámara de un celular.
- **Resultado:** pasa

| # | Paso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 1 | El encabezado tiene la búsqueda «Consultar boleta» | 1 | 1 | pasa |
| 2 | La etiqueta «Código de la boleta» se ve y está unida a su campo | sí | sí | pasa |
| 3 | El campo y «Consultar» miden 48 px de alto | 48 / 48 | 48 / 48 | pasa |
| 4 | Son las dos primeras paradas del Tab | Código de la boleta > Consultar | Código de la boleta > Consultar | pasa |
| 5 | Enter con el campo vacío: no navega, marca el error y deja el foco en el campo | / · true · Escribe el código de la boleta · con el foco | / · true · Escribe el código de la boleta · con el foco | pasa |
| 6 | Enter con el campo solo con espacios: no navega, marca el error y deja el foco en el campo | / · true · Escribe el código de la boleta · con el foco | / · true · Escribe el código de la boleta · con el foco | pasa |
| 7 | La compra se aprueba y ofrece «Ver mi boleta» con el código de la compra | sí | sí | pasa |
| 8 | Desde el título, el Tab llega a «Ver mi boleta» | sí | sí | pasa |
| 9 | Ninguna petición a la página de la boleta falla, ni la precarga | 0 | 0 | pasa |
| 10 | Enter en «Ver mi boleta» lleva a la boleta | /boletas/KWJZQDYH · Tu boleta | /boletas/KWJZQDYH · Tu boleta | pasa |
| 11 | La boleta trae el evento, el día, la hora, el lugar, la ciudad, los asientos, el comprador y el código | sí | sí | pasa |
| 12 | El estado es «Válida» y está el botón «Validar ingreso» | sí | sí | pasa |
| 13 | El código QR es una imagen con el nombre «Código QR de la boleta KWJZQDYH» | 1 | 1 | pasa |
| 14 | El QR, leído de una captura en tema claro, contiene la dirección de la boleta | http://localhost:3000/boletas/KWJZQDYH | http://localhost:3000/boletas/KWJZQDYH | pasa |
| 15 | Y también en tema oscuro | http://localhost:3000/boletas/KWJZQDYH | http://localhost:3000/boletas/KWJZQDYH | pasa |
| 16 | El fondo del QR es blanco en los dos temas | sí | sí | pasa |
| 17 | Boleta válida: violaciones serias o críticas de axe, en claro y oscuro | ninguna | ninguna | pasa |
| 18 | En una segunda pestaña la boleta está «Válida» | sí | sí | pasa |
| 19 | El correo del comprador no viaja a la página de la boleta | no | no | pasa |
| 20 | Mientras valida, el botón dice «Validando ingreso…» y queda deshabilitado | sí | sí | pasa |
| 21 | Un Enter y un clic más no envían otra validación | 1 | 1 | pasa |
| 22 | La boleta pasa a «Usada», con el día y la hora de uso | sí | sí | pasa |
| 23 | «Ingreso validado.» recibe el foco y el botón desaparece | sí | sí | pasa |
| 24 | Salió una sola validación, que respondió 200 | 200 | 200 | pasa |
| 25 | La página no se recargó | sigue | sigue | pasa |
| 26 | Boleta usada: violaciones serias o críticas de axe, en claro y oscuro | ninguna | ninguna | pasa |
| 27 | En la otra pestaña, validar otra vez avisa que ya fue usada, con el día y la hora del primer uso | sí | sí | pasa |
| 28 | El aviso recibe el foco, el estado pasa a «Usada» y el botón desaparece | sí | sí | pasa |
| 29 | La segunda validación respondió 409 | 200, 409 | 200, 409 | pasa |
| 30 | Boleta ya usada: violaciones serias o críticas de axe, en claro y oscuro | ninguna | ninguna | pasa |
| 31 | Al ir a la cartelera y volver con Atrás, la boleta sigue «Usada» y sin botón | sí | sí | pasa |
| 32 | Al recargar, la boleta sigue «Usada», con la misma fecha y sin botón | viernes, 20 de noviembre · 6:26 a. m. · 0 | viernes, 20 de noviembre · 6:26 a. m. · 0 | pasa |
| 33 | Con el código en minúsculas se abre la misma boleta, con el código en mayúsculas | sí | sí | pasa |
| 34 | Su QR lleva la dirección con el código en mayúsculas | http://localhost:3000/boletas/LHH7Z6R3 | http://localhost:3000/boletas/LHH7Z6R3 | pasa |
| 35 | Abierta por 127.0.0.1, el QR lleva esa dirección: el origen sale de la petición | http://127.0.0.1:3000/boletas/LHH7Z6R3 | http://127.0.0.1:3000/boletas/LHH7Z6R3 | pasa |
| 36 | Un código que no existe | No encontramos una boleta con ese código | No encontramos una boleta con ese código | pasa |
| 37 | Ofrece volver a la cartelera | / | / | pasa |
| 38 | Escribir el código con espacios y Enter lleva a la boleta, sin los espacios | /boletas/lhh7z6r3 · sí | /boletas/lhh7z6r3 · sí | pasa |
| 39 | Con un código que no existe, el formulario lleva al aviso | /boletas/zzzz9999 · No encontramos una boleta con ese código | /boletas/zzzz9999 · No encontramos una boleta con ese código | pasa |
| 40 | El borde de los seis campos tiene al menos 3 a 1 de contraste contra su fondo, en claro y oscuro | sí | sí | pasa |
| 41 | A 390 px la boleta no desborda | no | no | pasa |
| 42 | A 390 px el campo y el botón del encabezado y «Validar ingreso» miden al menos 44 px | sí | sí | pasa |
| 43 | A 390 px el QR se ve completo | sí | sí | pasa |
| 44 | Y se lee | http://localhost:3000/boletas/LHH7Z6R3 | http://localhost:3000/boletas/LHH7Z6R3 | pasa |
| 45 | Tema claro a 390 px: violaciones serias o críticas de axe | ninguna | ninguna | pasa |
| 46 | A 390 px, en tema claro, la cartelera con el encabezado nuevo no desborda | no | no | pasa |
| 47 | A 390 px y en tema oscuro el QR se lee | http://localhost:3000/boletas/LHH7Z6R3 | http://localhost:3000/boletas/LHH7Z6R3 | pasa |
| 48 | Validar con el teclado pasa la boleta a «Usada» | sí | sí | pasa |
| 49 | Sin desborde con la boleta usada | no | no | pasa |
| 50 | Tema oscuro a 390 px: violaciones serias o críticas de axe | ninguna | ninguna | pasa |
| 51 | A 390 px, en tema oscuro, la cartelera con el encabezado nuevo no desborda | no | no | pasa |
| 52 | Sin errores de consola, excepciones ni peticiones fallidas fuera de los esperados | 0 | 0 | pasa |

## Medidas

Al volver con Atrás a la boleta recién validada, el aviso «Ingreso validado.» sigue en pantalla: Next conserva la página tal como quedó.

Contraste del borde de cada campo (contra el fondo del campo / contra el fondo donde está puesto):
- Categoría, tema claro: 4,83 a 1 / 4,83 a 1
- Ciudad, tema claro: 4,83 a 1 / 4,83 a 1
- Fecha, tema claro: 4,83 a 1 / 4,83 a 1
- Código de la boleta, tema claro: 4,83 a 1 / 4,83 a 1
- Categoría, tema oscuro: 3,67 a 1 / 4,10 a 1
- Ciudad, tema oscuro: 3,67 a 1 / 4,10 a 1
- Fecha, tema oscuro: 3,67 a 1 / 4,10 a 1
- Código de la boleta, tema oscuro: 3,67 a 1 / 4,12 a 1
- Nombre completo, tema claro: 4,83 a 1 / 4,83 a 1
- Correo electrónico, tema claro: 4,83 a 1 / 4,83 a 1
- Nombre completo, tema oscuro: 3,67 a 1 / 4,10 a 1
- Correo electrónico, tema oscuro: 3,67 a 1 / 4,10 a 1

## Fallos provocados a propósito

La prueba valida dos veces la misma boleta, y la segunda responde 409 (paso 9 del plan). Lo que el navegador registró por eso no cuenta como error:

- 409 POST http://localhost:3001/boletas/KWJZQDYH/ingreso (el 409 del paso 9)
- consola: Failed to load resource: the server responded with a status of 409 (Conflict) (el 409 del paso 9)

## Peticiones que canceló el router de Next

Al navegar dentro de la aplicación, el router de Next deja de leer una respuesta cuando ya tiene los datos que necesita, y Chrome lo informa como petición cancelada (`net::ERR_ABORTED`). Depende del momento: unas veces aparece y otras no. No cuenta como error, porque los pasos que siguen a cada navegación comprueban que la página cargó completa.

- GET /boletas/KWJZQDYH?_rsc=By25X7HnRoiaO6fV
- GET /boletas/lhh7z6r3?_rsc=R206sb61bKJ3icLA
- GET /boletas/zzzz9999?_rsc=PqxWCfP20ZMM4mv_

---

El encabezado nuevo agrega un campo y un botón a todas las páginas, así que ajusté las pruebas de las specs anteriores para que busquen cada control por su nombre y no por su posición en el orden del Tab, y las repetí todas contra el código final de la spec, después de la ronda de correcciones (backend `63c4373`, frontend `7e0b47c`). Antes de las que compran o miran asientos libres reinicié el backend, porque los datos viven en memoria.

| Prueba | Resultado |
|---|---|
| `006-boleta.mjs` | 52 de 52 |
| `005-compra.mjs` | 50 de 50 |
| `004-mapa.mjs` | 37 de 37 |
| `003-fecha.mjs` | 12 de 12 |
| `002-filtros.mjs` | 14 de 14 |

La primera vez que las repetí, antes de los controles, la de la spec 002 falló en un solo paso, y no por el encabezado: esperaba la dirección `/?categoria=teatro&ciudad=Neiva` y la página dio `/?categoria=teatro&ciudad=Neiva&fecha=`. La diferencia viene de la spec 003, que agregó el campo de fecha al formulario (decisión D8 de su plan: un formulario envía también sus campos vacíos). La prueba no se había vuelto a ejecutar desde entonces. Corregí la dirección esperada y pasó.

Después de la revisión le agregué a la prueba de la boleta lo que pidieron los controles: la accesibilidad a 390 px en tema claro con la boleta con datos (M1 del revisor), ir a la cartelera y volver con Atrás a una boleta recién validada (B3 del revisor) y dos capturas de estados de error (`encabezado-error-1280-claro.png` y `boleta-ya-usada-1280-claro.png`). Por eso pasó de 50 a 52 comprobaciones.

Estas son las salidas:

# Spec 005 · Compra con pago simulado, con teclado

- **Fecha:** 20/11/2026, 6:27:17 a. m.
- **Cómo:** prueba automática en Chrome, a 1280 px y a 390 px, con Tab y Enter. Compra de verdad seis asientos de la función 1 contra el backend recién iniciado.
- **Resultado:** pasa

| # | Paso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 1 | Elegir A1 y A2 y pulsar Enter en «Continuar» lleva a la compra | /funciones/1/compra?asientos=A1,A2 | /funciones/1/compra?asientos=A1,A2 | pasa |
| 2 | Ninguna petición a la página de compra falla, ni la precarga | 0 | 0 | pasa |
| 3 | El título de la página | Tu compra | Tu compra | pasa |
| 4 | El resumen trae el evento, el día, la hora, el lugar, los asientos y el total | sí | sí | pasa |
| 5 | La etiqueta «Nombre completo» se ve y está unida a su campo | sí | sí | pasa |
| 6 | La etiqueta «Correo electrónico» se ve y está unida a su campo | sí | sí | pasa |
| 7 | El botón dice «Pagar $ 30.000» | 1 | 1 | pasa |
| 8 | Los dos campos y el botón miden 48 px de alto | 48 / 48 / 48 | 48 / 48 / 48 | pasa |
| 9 | Con Tab, después de «Volver a la cartelera» vienen el nombre, el correo y el botón | Nombre completo > Correo electrónico > Pagar $ 30.000 | Nombre completo > Correo electrónico > Pagar $ 30.000 | pasa |
| 10 | Con los campos vacíos, el nombre lleva su error como descripción | Escribe tu nombre completo | Escribe tu nombre completo | pasa |
| 11 | Y el correo, el suyo | Escribe tu correo electrónico | Escribe tu correo electrónico | pasa |
| 12 | Los dos campos se marcan como inválidos | true / true | true / true | pasa |
| 13 | El foco queda en el nombre | sí | sí | pasa |
| 14 | No se envía ninguna compra | 0 | 0 | pasa |
| 15 | Con un correo sin formato, el único error es el del correo | Escribe un correo electrónico válido | Escribe un correo electrónico válido | pasa |
| 16 | El error del nombre desaparece | 0 | 0 | pasa |
| 17 | El foco queda en el correo | sí | sí | pasa |
| 18 | Sigue sin enviarse ninguna compra | 0 | 0 | pasa |
| 19 | Mientras se procesa, el botón dice «Procesando pago…» y queda deshabilitado | sí | sí | pasa |
| 20 | Un Enter y un clic más no envían otra compra | 1 | 1 | pasa |
| 21 | Aparece «¡Compra aprobada!» y recibe el foco | sí | sí | pasa |
| 22 | Muestra un código de 8 letras mayúsculas o dígitos | sí | sí | pasa |
| 23 | Muestra los asientos y el total | sí | sí | pasa |
| 24 | Compra aprobada: violaciones serias o críticas de axe, en claro y oscuro | ninguna | ninguna | pasa |
| 25 | En el mapa, A1 y A2 aparecen ocupados | sí | sí | pasa |
| 26 | Con un asiento ya vendido, el aviso nombra A2 y no A3 | sí | sí | pasa |
| 27 | El formulario de la compra ya no está | 0 | 0 | pasa |
| 28 | «Elegir otros asientos» lleva al mapa | /funciones/1 | /funciones/1 | pasa |
| 29 | El foco queda en «Elegir otros asientos» | sí | sí | pasa |
| 30 | Asientos no disponibles: violaciones serias o críticas de axe, en claro y oscuro | ninguna | ninguna | pasa |
| 31 | Enter en el enlace vuelve al mapa: A2 ocupado y A3 disponible | sí | sí | pasa |
| 32 | Si el pago falla aparece un aviso con role="alert" | 1 | 1 | pasa |
| 33 | Los campos conservan lo escrito | Ana Pérez / ana@correo.co | Ana Pérez / ana@correo.co | pasa |
| 34 | «Pagar $ 30.000» queda habilitado y con el foco | sí | sí | pasa |
| 35 | Fallo del pago: violaciones serias o críticas de axe, en claro y oscuro | ninguna | ninguna | pasa |
| 36 | Al reintentar sin volver a escribir, la compra se aprueba con B1 y B2 | sí | sí | pasa |
| 37 | El aviso de fallo ya no está | 0 | 0 | pasa |
| 38 | Entre el fallo y el reintento salieron dos envíos | 2 | 2 | pasa |
| 39 | Dirección sin asientos | Elige tus asientos primero → /funciones/1 | Elige tus asientos primero → /funciones/1 | pasa |
| 40 | Dirección con `?asientos=Z9` | Elige tus asientos primero → /funciones/1 | Elige tus asientos primero → /funciones/1 | pasa |
| 41 | Dirección con `?asientos=A1,A1` | Elige tus asientos primero → /funciones/1 | Elige tus asientos primero → /funciones/1 | pasa |
| 42 | A 390 px no hay desborde con el formulario | no | no | pasa |
| 43 | A 390 px los campos y el botón miden al menos 44 px de alto | sí | sí | pasa |
| 44 | A 390 px el botón ocupa todo el ancho, como los campos | sí | sí | pasa |
| 45 | A 390 px no hay desborde con los errores de campo | no | no | pasa |
| 46 | A 390 px aparece el aviso de fallo, sin desborde | 1 / no | 1 / no | pasa |
| 47 | A 390 px y en tema oscuro, la compra de C1 y C2 se aprueba | sí | sí | pasa |
| 48 | Sin desborde con la compra aprobada | no | no | pasa |
| 49 | Tema oscuro a 390 px: violaciones serias o críticas de axe | ninguna | ninguna | pasa |
| 50 | Sin errores de consola, excepciones ni peticiones fallidas fuera de los esperados | 0 | 0 | pasa |

Dirección tal como queda en el navegador después de «Continuar»: `/funciones/1/compra?asientos=A1,A2`. Peticiones a la página de compra antes de pulsar Enter (precargas): 3.

## Fallos provocados a propósito

La prueba provoca un 409 (paso 10 del plan) y aborta dos envíos (pasos 12 y 15). Lo que el navegador registró por eso no cuenta como error:

- 409 POST http://localhost:3001/funciones/1/compras (el 409 del paso 10)
- consola: Failed to load resource: the server responded with a status of 409 (Conflict) (el 409 del paso 10)
- petición fallida (net::ERR_CONNECTION_REFUSED): POST http://localhost:3001/funciones/1/compras (el aborto del paso 12)
- consola: Failed to load resource: net::ERR_CONNECTION_REFUSED (el aborto del paso 12)
- consola: No se pudo completar la compra con la API: TypeError: Failed to fetch
    at s (http://localhost:3000/_next/static/chunks/25kvsxw07vrio.js:1:8249)
    at E (http://localhost:3000/_next/static/chunks/25kvsxw07vrio.js:1:11712)
    at s5 (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:175387)
    at http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:181235
    at tU (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:41740)
    at cn (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:176620)
    at fq (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:214848)
    at fQ (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:214670) (el aborto del paso 12)
- petición fallida (net::ERR_CONNECTION_REFUSED): POST http://localhost:3001/funciones/1/compras (el aborto del paso 15)
- consola: Failed to load resource: net::ERR_CONNECTION_REFUSED (el aborto del paso 15)
- consola: No se pudo completar la compra con la API: TypeError: Failed to fetch
    at s (http://localhost:3000/_next/static/chunks/25kvsxw07vrio.js:1:8249)
    at E (http://localhost:3000/_next/static/chunks/25kvsxw07vrio.js:1:11712)
    at s5 (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:175387)
    at http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:181235
    at tU (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:41740)
    at cn (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:176620)
    at fq (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:214848)
    at fQ (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:214670) (el aborto del paso 15)

## Peticiones que canceló el router de Next

Al navegar dentro de la aplicación, el router de Next deja de leer una respuesta cuando ya tiene los datos que necesita, y Chrome lo informa como petición cancelada (`net::ERR_ABORTED`). Depende del momento: unas veces aparece y otras no. No cuenta como error, porque los pasos que siguen a cada navegación comprueban que la página cargó completa.

- GET /funciones/1?_rsc=f19BizGiWWa32s28

---

# Spec 004 · Mapa de asientos con teclado

- **Fecha:** 20/11/2026, 6:27:29 a. m.
- **Cómo:** prueba automática en Chrome, a 1280 px y a 390 px, con Tab, Espacio y Enter.
- **Resultado:** pasa

| # | Paso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 1 | El detalle del evento 4 enlaza a la función 5 | 1 | 1 | pasa |
| 2 | Tab y Enter en la función llevan a /funciones/5 | Cartas a Medianoche | Cartas a Medianoche | pasa |
| 3 | Hay cinco filas de asientos | 5 | 5 | pasa |
| 4 | Cada fila tiene 8 asientos | 8,8,8,8,8 | 8,8,8,8,8 | pasa |
| 5 | Se indica dónde queda el escenario | sí | sí | pasa |
| 6 | Sin asientos elegidos | sí | sí | pasa |
| 7 | «Continuar» está deshabilitado | sí | sí | pasa |
| 8 | Con Tab se llega al asiento A1 | sí | sí | pasa |
| 9 | Espacio selecciona A1 y lo expone con aria-pressed | true | true | pasa |
| 10 | La lista y el total cambian | sí | sí | pasa |
| 11 | «Continuar» lleva los asientos | /funciones/5/compra?asientos=A1 | /funciones/5/compra?asientos=A1 | pasa |
| 12 | Tab pasa al asiento A2 | sí | sí | pasa |
| 13 | Enter selecciona A2 | sí | sí | pasa |
| 14 | Tab salta los ocupados A3 y A4 y llega a A5 | sí | sí | pasa |
| 15 | Un asiento ocupado no se puede seleccionar | sí | sí | pasa |
| 16 | Pulsar A2 otra vez lo deselecciona | sí | sí | pasa |
| 17 | Seis asientos elegidos | sí | sí | pasa |
| 18 | El séptimo muestra el aviso y no cambia la selección | sí | sí | pasa |
| 19 | Al quitar uno, el aviso desaparece | sí | sí | pasa |
| 20 | Sin asientos, «Continuar» vuelve a deshabilitarse | sí | sí | pasa |
| 21 | Los asientos van en el orden del mapa, no en el de los clics | /funciones/5/compra?asientos=A1,A2 | /funciones/5/compra?asientos=A1,A2 | pasa |
| 22 | La precarga de «Continuar» no falla | 0 | 0 | pasa |
| 23 | Enter en «Continuar» lleva a la compra con los asientos | /funciones/5/compra?asientos=A1,A2 | /funciones/5/compra?asientos=A1,A2 | pasa |
| 24 | A 390 px hay 40 asientos | 40 | 40 | pasa |
| 25 | A 390 px ningún asiento mide menos de 44 px | sí | sí | pasa |
| 26 | A 390 px los asientos vecinos no se tocan | sí | sí | pasa |
| 27 | A 390 px no hay desborde horizontal | no | no | pasa |
| 28 | Tema claro: el seleccionado lleva una marca además del color | sí | sí | pasa |
| 29 | Tema claro: el ocupado va con borde discontinuo y tachado | dashed / line-through | dashed / line-through | pasa |
| 30 | Tema oscuro: el seleccionado lleva una marca además del color | sí | sí | pasa |
| 31 | Tema oscuro: el ocupado va con borde discontinuo y tachado | dashed / line-through | dashed / line-through | pasa |
| 32 | La función 10 muestra su evento, día, hora y precio | sí | sí | pasa |
| 33 | En la función 10 todos los asientos están libres | 40 | 40 | pasa |
| 34 | Seis asientos de $ 8.000 suman $ 48.000 y el séptimo no entra | sí | sí | pasa |
| 35 | Una función que no existe | No encontramos esa función | No encontramos esa función | pasa |
| 36 | Ofrece volver a la cartelera | / | / | pasa |
| 37 | Sin errores de consola ni peticiones fallidas en todo el recorrido | 0 | 0 | pasa |

Dirección tal como queda en el navegador después de «Continuar»: `/funciones/5/compra?asientos=A1,A2`. El enlace lleva la coma literal (`asientos=A1,A2`); al navegar, Next la escribe como `%2C`. Decodificada es la misma dirección, y la página de compra recibe «A1,A2».

---

# Spec 003 · Filtro «Fecha» y funciones con teclado

- **Fecha:** 20/11/2026, 6:27:34 a. m.
- **Cómo:** prueba automática en Chrome a 1280 px, solo con Tab, las teclas de los números y Enter.
- **Resultado:** pasa

| # | Paso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 1 | Tab llega a «Fecha» | sí | sí | pasa |
| 2 | Escribir 21/11/2026 con el teclado | 2026-11-21 | 2026-11-21 | pasa |
| 3 | Después de «Fecha», Tab llega a «Filtrar» | sí | sí | pasa |
| 4 | Enter en «Filtrar» pone la fecha en la dirección | sí | sí | pasa |
| 5 | Quedan solo los eventos con función ese día | Bambucos al Atardecer, Cartas a Medianoche, El Inspector Distraído, El Último Faro | Bambucos al Atardecer, Cartas a Medianoche, El Inspector Distraído, El Último Faro | pasa |
| 6 | El campo conserva la fecha | 2026-11-21 | 2026-11-21 | pasa |
| 7 | La fecha se combina con la categoría | Cartas a Medianoche, El Inspector Distraído | Cartas a Medianoche, El Inspector Distraído | pasa |
| 8 | Un día sin funciones | No hay eventos con esos filtros | No hay eventos con esos filtros | pasa |
| 9 | El detalle tiene la sección «Funciones» | sí | sí | pasa |
| 10 | El evento 4 lista sus funciones como enlaces | al menos 1 | al menos 1 | pasa |
| 11 | El enlace de la función dice el día y la hora | sí | sí | pasa |
| 12 | Tab llega al enlace de la función | sí | sí | pasa |

## Paradas de Tab dentro del campo «Fecha»

El campo nativo de Chrome tiene 2 paradas: el día, el mes, el año y el icono del calendario.

| Parada | El campo muestra su contorno de foco |
|---|---|
| 1 | sí |
| 2 | no |

---

# Spec 002 · Filtros de la cartelera con teclado

- **Fecha:** 20/11/2026, 6:27:36 a. m.
- **Cómo:** prueba automática en Chrome a 1280 px, solo con Tab, flechas y Enter.
- **Resultado:** pasa

| # | Paso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 1 | Abrir la cartelera | 10 eventos | 10 eventos | pasa |
| 2 | Tab llega a «Categoría» | sí | sí | pasa |
| 3 | Flecha abajo hasta «Teatro» | Teatro | Teatro | pasa |
| 4 | Tab llega a «Ciudad» | sí | sí | pasa |
| 5 | Flecha abajo hasta «Neiva» | Neiva | Neiva | pasa |
| 6 | Tab llega a «Filtrar» | sí | sí | pasa |
| 7 | Enter en «Filtrar» cambia la dirección | /?categoria=teatro&ciudad=Neiva&fecha= | /?categoria=teatro&ciudad=Neiva&fecha= | pasa |
| 8 | La cartelera queda filtrada | Cartas a Medianoche | Cartas a Medianoche | pasa |
| 9 | Los filtros quedan marcados | Teatro / Neiva | Teatro / Neiva | pasa |
| 10 | Filtros sin resultado | No hay eventos con esos filtros | No hay eventos con esos filtros | pasa |
| 11 | Tab llega a «Ver todos los eventos» | sí | sí | pasa |
| 12 | Enter en el enlace quita los filtros | / | / | pasa |
| 13 | Vuelven todos los eventos | 10 eventos | 10 eventos | pasa |
| 14 | Los filtros vuelven a «Todas» | Todas / Todas | Todas / Todas | pasa |
