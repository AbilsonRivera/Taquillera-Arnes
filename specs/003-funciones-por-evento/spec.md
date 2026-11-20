# 003 · Funciones por evento

- **Estado:** implementada y revisada
- **Rama:** `feat/003-funciones-por-evento`
- **Repositorios:** backend, frontend
- **Pull requests:** [Backend #6](https://github.com/Bredman01/Taquillera-Backend/pull/6) y [Frontend #6](https://github.com/Bredman01/TaquilleraFrontend/pull/6)

## Por qué

Para comprar una boleta hay que elegir cuándo se asiste. Hoy el backend solo conoce eventos, y el detalle no dice en qué fechas ni a qué horas se presentan. Sin fechas tampoco se puede filtrar la cartelera por día, que es el tercer filtro de la propuesta.

## Qué se construye

El backend expone las funciones de cada evento, el detalle del evento las muestra agrupadas por día, y la cartelera se puede filtrar por fecha.

## Criterios de aceptación

### API

- **CA-1:** La API devuelve las funciones de un evento existente. Cada función trae su identificador, el identificador del evento, la fecha y hora de inicio y el precio por boleta, y la lista viene ordenada por inicio, de la más próxima a la más lejana.
- **CA-2:** Al pedir las funciones de un evento que no existe, la API responde 404 con el mensaje «El evento {id} no existe».
- **CA-3:** Para un evento existente sin funciones, la API responde 200 con una lista vacía.
- **CA-4:** Si el id del evento no es un entero, la API responde 400.
- **CA-5:** La lista de eventos se puede filtrar por fecha: devuelve los eventos que tienen alguna función ese día, en hora de Colombia. El filtro se combina con los de categoría y ciudad. Con una fecha que no tiene el formato `AAAA-MM-DD`, la API responde 400.

### Interfaz

- **CA-6:** El detalle del evento muestra una sección «Funciones» con las funciones agrupadas por día. Cada día se escribe en español con el día de la semana, el número y el mes (por ejemplo «sábado, 21 de noviembre»).
- **CA-7:** Cada función muestra la hora en formato de 12 horas con «a. m.» o «p. m.» y el precio en pesos sin decimales y con punto de miles (15000 se muestra como «$ 15.000»).
- **CA-8:** Cada función es un enlace a `/funciones/{id}` cuyo nombre accesible incluye el día y la hora.
- **CA-9:** Si el evento no tiene funciones, la sección muestra «No hay funciones programadas».
- **CA-10:** Si las funciones no se pueden cargar, la sección muestra un mensaje con `role="alert"` y el resto del detalle del evento se sigue viendo.
- **CA-11:** La cartelera tiene un filtro «Fecha». Al elegir un día, la dirección lo refleja (por ejemplo `/?fecha=2026-11-21`) y la cartelera muestra solo los eventos con función ese día, combinado con los filtros de categoría y ciudad.
- **CA-12:** En 390 px y en 1280 px de ancho, en tema claro y oscuro, las páginas no tienen violaciones de axe de impacto serio o crítico ni errores de consola.

## Fuera de alcance

- La página `/funciones/{id}` y el mapa de asientos: van en la spec 004.
- Crear, editar o borrar funciones.
- Ocultar las funciones que ya pasaron.

## Notas del dominio

- Una función es una presentación de un evento, en el lugar del evento, con una fecha y hora de inicio y un precio por boleta.
- El precio es un número entero en pesos colombianos.
- Las horas se guardan con su zona horaria y se muestran siempre en hora de Colombia, sin importar dónde corra el servidor.
- Los datos viven en memoria. Los de ejemplo incluyen al menos tres eventos con funciones en dos días distintos y un evento sin funciones.
- El formato de dinero, fechas y horas vive en `src/lib/formato.ts`, como pide la skill `guia-visual`.
