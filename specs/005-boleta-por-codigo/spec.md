# 005 · Boleta por código

- **Estado:** aprobada
- **Rama:** `feat/005-boleta-por-codigo`
- **Repositorios:** backend, frontend
- **Pull requests:** pendientes

## Por qué

Después de pagar, el comprador necesita un comprobante que pueda volver a abrir, y en la puerta alguien debe poder confirmar que esa boleta es real y que no se ha usado antes. Sin eso, una misma boleta sirve para entrar varias veces.

## Qué se construye

La consulta de una boleta por su código y la validación del ingreso, que la marca como usada una sola vez.

## Criterios de aceptación

### API

- **CA-1:** La API devuelve la boleta de un código, con el código, el título de la película, la fecha y hora de la función, la sala, los asientos, el nombre del comprador y el estado («valida» o «usada»; si está usada, con la fecha y hora en que se usó). Si el código no existe responde 404 con «La boleta {código} no existe».
- **CA-2:** El código se acepta en mayúsculas o en minúsculas.
- **CA-3:** Al validar el ingreso de una boleta válida, la API responde 200 con el estado «usada» y la fecha y hora de uso.
- **CA-4:** Al validar una boleta que ya se usó, la API responde 409 con «La boleta {código} ya fue usada» y la fecha y hora del primer uso, que no cambia.
- **CA-5:** Al validar un código que no existe, la API responde 404.

### Interfaz

- **CA-6:** La página `/boletas/{código}` muestra el título de la película, el día y la hora de la función, la sala, los asientos, el nombre del comprador, el código y el estado: «Válida» o «Usada» con la fecha y hora de uso.
- **CA-7:** Si el código no existe, la página muestra «No encontramos una boleta con ese código».
- **CA-8:** Una boleta válida muestra el botón «Validar ingreso». Al pulsarlo, la boleta pasa a «Usada» sin recargar la página a mano y el botón desaparece.
- **CA-9:** Si al validar la API responde 409, la página muestra «Esta boleta ya fue usada» con la fecha y hora del primer uso.
- **CA-10:** El encabezado del sitio tiene un formulario «Consultar boleta» con el campo «Código de la boleta», que lleva a `/boletas/{código}`. Con el campo vacío no navega.
- **CA-11:** La confirmación de la compra (spec 004) incluye el enlace «Ver mi boleta» a `/boletas/{código}`.
- **CA-12:** En 390 px y en 1280 px de ancho, en tema claro y oscuro, la página no tiene violaciones de axe de impacto serio o crítico ni errores de consola.

## Fuera de alcance

- Código QR y lectura con la cámara.
- Descarga de la boleta en PDF y envío por correo.
- Un rol de validador con inicio de sesión: cualquiera con el código puede validar.

## Notas del dominio

- Cada compra genera una sola boleta, que cubre todos sus asientos y se identifica con el código de la compra.
- Una boleta tiene dos estados: válida, si todavía no se ha ingresado con ella, y usada.
- La validación es definitiva: una boleta usada no vuelve a ser válida.
