# Spec 005 · Compra con pago simulado, con teclado

- **Fecha:** 20/11/2026, 2:08:10 a. m.
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
| 27 | El formulario ya no está | 0 | 0 | pasa |
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
    at s (http://localhost:3000/_next/static/chunks/2u3_ldz2-etmz.js:1:8309)
    at w (http://localhost:3000/_next/static/chunks/2u3_ldz2-etmz.js:1:11459)
    at s5 (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:175387)
    at http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:181235
    at tU (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:41740)
    at cn (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:176620)
    at fq (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:214848)
    at fQ (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:214670) (el aborto del paso 12)
- petición fallida (net::ERR_CONNECTION_REFUSED): POST http://localhost:3001/funciones/1/compras (el aborto del paso 15)
- consola: Failed to load resource: net::ERR_CONNECTION_REFUSED (el aborto del paso 15)
- consola: No se pudo completar la compra con la API: TypeError: Failed to fetch
    at s (http://localhost:3000/_next/static/chunks/2u3_ldz2-etmz.js:1:8309)
    at w (http://localhost:3000/_next/static/chunks/2u3_ldz2-etmz.js:1:11459)
    at s5 (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:175387)
    at http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:181235
    at tU (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:41740)
    at cn (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:176620)
    at fq (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:214848)
    at fQ (http://localhost:3000/_next/static/chunks/3iz8_hoapa1o_.js:1:214670) (el aborto del paso 15)

## Peticiones que canceló el router de Next

Al navegar dentro de la aplicación, el router de Next deja de leer una respuesta cuando ya tiene los datos que necesita, y Chrome lo informa como petición cancelada (`net::ERR_ABORTED`). Depende del momento: unas veces aparece y otras no. No cuenta como error, porque los pasos que siguen a cada navegación comprueban que la página cargó completa.

- GET /funciones/1/compra?asientos=A1,A2&_rsc=QvjlWtdKHYqdz7Lt
- GET /funciones/1?_rsc=f19BizGiWWa32s28

---

Después de quitar `prefetch={false}` de «Continuar» (D17) cambié la comprobación 22 de la prueba de la spec 004, que antes exigía que no hubiera precarga, y la repetí con el backend recién iniciado. Esta es su salida:

# Spec 004 · Mapa de asientos con teclado

- **Fecha:** 20/11/2026, 2:08:55 a. m.
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
| 8 | La segunda parada de Tab es el asiento A1 | sí | sí | pasa |
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
