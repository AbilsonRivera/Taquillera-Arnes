# 004 · Mapa de asientos

- **Estado:** implementada y revisada; en pull request
- **Rama:** `feat/004-mapa-de-asientos`
- **Repositorios:** backend, frontend
- **Pull requests:** [Backend #7](https://github.com/Bredman01/Taquillera-Backend/pull/7) y [Frontend #7](https://github.com/Bredman01/TaquilleraFrontend/pull/7)

## Por qué

Las boletas de Taquillera son de asiento numerado. Antes de pagar, el comprador necesita ver qué asientos quedan libres en la función y elegir los suyos.

## Qué se construye

La página de una función, con el mapa del lugar, la selección de asientos y el total a pagar.

## Criterios de aceptación

### API

- **CA-1:** La API devuelve una función por su id, con el identificador, el título, la ciudad y el lugar del evento, la fecha y hora de inicio y el precio por boleta. Si la función no existe responde 404 con «La función {id} no existe», y si el id no es un entero responde 400.
- **CA-2:** La API devuelve los 40 asientos de una función, cada uno con su identificador (por ejemplo «A1»), su fila, su número y su estado («disponible» u «ocupado»), ordenados por fila y por número. Si la función no existe responde 404.

### Interfaz

- **CA-3:** La página `/funciones/{id}` muestra el título del evento, el día y la hora de la función, el lugar, la ciudad y el precio por boleta.
- **CA-4:** La página muestra dónde queda el escenario o la pantalla y los asientos organizados por fila. Cada asiento es un control cuyo nombre accesible dice la fila, el número y el estado (por ejemplo «Fila A, asiento 1, disponible»).
- **CA-5:** Un asiento ocupado no se puede seleccionar, y se distingue de uno disponible por algo más que el color.
- **CA-6:** Al pulsar un asiento disponible queda seleccionado, y al pulsarlo otra vez se deselecciona. El estado seleccionado se expone a los lectores de pantalla.
- **CA-7:** La página muestra la lista de asientos seleccionados y el total en pesos (precio por la cantidad), y ambos se actualizan con cada cambio.
- **CA-8:** No se pueden seleccionar más de 6 asientos. Al intentar el séptimo aparece «Puedes comprar máximo 6 boletas por compra» y la selección no cambia.
- **CA-9:** El botón «Continuar» está deshabilitado mientras no haya asientos seleccionados. Con asientos lleva a `/funciones/{id}/compra?asientos=A1,A2`, con los identificadores elegidos.
- **CA-10:** Si la función no existe, la página muestra «No encontramos esa función» y un enlace a la cartelera. Si el backend no responde, muestra un mensaje con `role="alert"`.
- **CA-11:** En 390 px y en 1280 px de ancho, en tema claro y oscuro, la página no tiene violaciones de axe de impacto serio o crítico ni errores de consola, y el mapa se puede recorrer con el teclado.

## Fuera de alcance

- La página de compra y el pago: van en la spec 005.
- Reservar asientos por un tiempo mientras el comprador decide.
- Lugares con distribuciones distintas o precios por zona.

## Notas del dominio

- Todos los lugares tienen 5 filas, de la A a la E, con 8 asientos cada una.
- Un asiento se identifica dentro de su función con la fila y el número («A1»).
- El límite es de 6 boletas por compra.
- Los datos de ejemplo incluyen al menos una función con algunos asientos ocupados.
- Los botones, los estados de los asientos y los mensajes salen de la skill `guia-visual`.
