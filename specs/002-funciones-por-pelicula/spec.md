# 002 · Funciones por película

- **Estado:** aprobada
- **Rama:** `feat/002-funciones-por-pelicula`
- **Repositorios:** backend, frontend
- **Pull requests:** pendientes

## Por qué

Para comprar una boleta hay que elegir cuándo y en qué sala se ve la película. Hoy el backend solo conoce películas, y el detalle no dice a qué horas se proyectan.

## Qué se construye

El backend expone las funciones de cada película y el detalle de la película las muestra agrupadas por día, cada una como entrada hacia la selección de asientos.

## Criterios de aceptación

### API

- **CA-1:** La API devuelve las funciones de una película existente. Cada función trae su identificador, el identificador de la película, la fecha y hora de inicio, la sala y el precio por boleta, y la lista viene ordenada por inicio, de la más próxima a la más lejana.
- **CA-2:** Al pedir las funciones de una película que no existe, la API responde 404 con el mensaje «La película {id} no existe».
- **CA-3:** Para una película existente sin funciones, la API responde 200 con una lista vacía.
- **CA-4:** Si el id de la película no es un entero, la API responde 400.

### Interfaz

- **CA-5:** El detalle de la película muestra una sección «Funciones» con las funciones agrupadas por día. Cada día se escribe en español con el día de la semana, el número y el mes (por ejemplo «sábado, 21 de noviembre»).
- **CA-6:** Cada función muestra la hora en formato de 12 horas con «a. m.» o «p. m.», la sala y el precio en pesos sin decimales y con punto de miles (15000 se muestra como «$ 15.000»).
- **CA-7:** Cada función es un enlace a `/funciones/{id}` cuyo nombre accesible incluye la hora y la sala.
- **CA-8:** Si la película no tiene funciones, la sección muestra «No hay funciones programadas».
- **CA-9:** Si las funciones no se pueden cargar, la sección muestra un mensaje con `role="alert"` y el resto del detalle de la película se sigue viendo.
- **CA-10:** En 390 px y en 1280 px de ancho, en tema claro y oscuro, la página no tiene violaciones de axe de impacto serio o crítico ni errores de consola.

## Fuera de alcance

- La página `/funciones/{id}` y el mapa de asientos: van en la spec 003.
- Crear, editar o borrar funciones.
- Ocultar las funciones que ya pasaron.

## Notas del dominio

- Una función es la proyección de una película en una sala, con una fecha y hora de inicio y un precio por boleta.
- El precio es un número entero en pesos colombianos.
- Las horas se guardan con su zona horaria y se muestran siempre en hora de Colombia, sin importar dónde corra el servidor.
- Los datos viven en memoria. Los de ejemplo incluyen al menos dos películas con funciones en dos días distintos y una película sin funciones.
