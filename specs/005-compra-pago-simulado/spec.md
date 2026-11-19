# 005 · Compra con pago simulado

- **Estado:** aprobada
- **Rama:** `feat/005-compra-pago-simulado`
- **Repositorios:** backend, frontend
- **Pull requests:** pendientes

## Por qué

Elegir asientos no sirve si no se pueden comprar. El problema que la propuesta quiere resolver es justo este: en los eventos pequeños se vende dos veces el mismo asiento. Esta spec es la que debe impedirlo.

## Qué se construye

La compra de los asientos elegidos, con los datos del comprador y un pago simulado, y la confirmación con el código de la compra.

## Criterios de aceptación

### API

- **CA-1:** La API crea una compra con la función, los asientos, el nombre y el correo del comprador, y responde 201 con el código de la compra, la función, los asientos, el total (precio por la cantidad) y la fecha de la compra.
- **CA-2:** Después de una compra, sus asientos figuran como ocupados en el mapa de esa función.
- **CA-3:** Si alguno de los asientos pedidos ya está ocupado, la API responde 409 con un mensaje que nombra los asientos no disponibles, y no ocupa ninguno de los asientos pedidos.
- **CA-4:** La API responde 400, sin ocupar asientos, cuando la lista de asientos está vacía, tiene más de 6, tiene repetidos o incluye un asiento que no existe en el lugar, y cuando el nombre está vacío o el correo no tiene formato de correo.
- **CA-5:** Si la función no existe, la API responde 404 con «La función {id} no existe».

### Interfaz

- **CA-6:** La página `/funciones/{id}/compra?asientos=A1,A2` muestra el resumen de la compra: evento, día y hora, lugar, asientos y total en pesos.
- **CA-7:** La página tiene un formulario con los campos «Nombre completo» y «Correo electrónico», cada uno con su etiqueta visible. Al enviarlo con un campo vacío o con un correo inválido muestra el error junto al campo y no envía la compra.
- **CA-8:** El botón de pago muestra el total («Pagar $ 30.000»). Mientras la compra se procesa queda deshabilitado y dice «Procesando pago…», de modo que no se puede enviar dos veces.
- **CA-9:** Cuando la compra se aprueba, la página muestra «¡Compra aprobada!» con el código de la compra, los asientos y el total.
- **CA-10:** Si la API responde 409, la página muestra «Estos asientos ya no están disponibles:» seguido de los asientos, y un enlace «Elegir otros asientos» a `/funciones/{id}`.
- **CA-11:** Si la dirección no trae asientos, o trae alguno que no existe en el lugar, la página muestra «Elige tus asientos primero» y un enlace al mapa de la función.
- **CA-12:** Si el backend no responde al pagar, la página muestra un mensaje con `role="alert"` y permite intentarlo de nuevo sin volver a escribir los datos.
- **CA-13:** En 390 px y en 1280 px de ancho, en tema claro y oscuro, la página no tiene violaciones de axe de impacto serio o crítico ni errores de consola.

## Fuera de alcance

- Pasarelas de pago reales, medios de pago y reembolsos.
- Cuentas de usuario e inicio de sesión.
- Envío de la boleta por correo.
- La página de la boleta y su código QR: van en la spec 006.

## Notas del dominio

- El pago es simulado: toda compra con datos válidos y asientos libres se aprueba.
- El código de la compra tiene 8 caracteres, letras mayúsculas y números, y no se repite.
- La compra es todo o nada: si un asiento falla, no se vende ninguno.
- Los datos viven en memoria y se pierden al reiniciar el backend.
- El formulario, los botones y los mensajes salen de la skill `guia-visual`.
