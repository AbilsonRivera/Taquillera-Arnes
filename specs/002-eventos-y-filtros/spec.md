# 002 · Eventos y filtros de la cartelera

- **Estado:** aprobada
- **Rama:** `feat/002-eventos-y-filtros`
- **Repositorios:** backend, frontend
- **Pull requests:** pendientes

## Por qué

La propuesta del proyecto es una cartelera de eventos pequeños: obras de teatro, conciertos, charlas y también cine. La aplicación, en cambio, solo conoce películas, porque así empezó la primera pantalla. Si seguimos construyendo funciones, asientos y compras sobre «películas», el producto termina siendo otro.

Este es el momento más barato para corregirlo: solo existen la cartelera y el detalle.

## Qué se construye

El backend y el frontend pasan de «películas» a «eventos», con categoría, ciudad y lugar, y la cartelera se puede filtrar por categoría y por ciudad.

## Criterios de aceptación

### API

- **CA-1:** La API devuelve la lista de eventos. Cada evento trae su identificador, título, descripción, categoría («cine», «teatro», «concierto» o «charla»), ciudad, lugar, duración en minutos, clasificación por edad e imagen.
- **CA-2:** La API devuelve un evento por su id. Si no existe responde 404 con «El evento {id} no existe», y si el id no es un entero responde 400.
- **CA-3:** La lista de eventos se puede filtrar por categoría, por ciudad o por las dos a la vez.
- **CA-4:** Con una categoría que no es una de las cuatro, la API responde 400. Con una ciudad que no tiene eventos, responde 200 con una lista vacía.
- **CA-5:** La API devuelve las ciudades que tienen eventos, sin repetir y en orden alfabético.
- **CA-6:** Las rutas de películas dejan de existir: `GET /peliculas` responde 404.

### Interfaz

- **CA-7:** La cartelera muestra los eventos. Cada tarjeta muestra el título, la categoría, la ciudad y la duración, y es un enlace a `/eventos/{id}`.
- **CA-8:** La cartelera tiene un filtro «Categoría», con «Todas», «Cine», «Teatro», «Concierto» y «Charla», y un filtro «Ciudad», con «Todas» y las ciudades que tienen eventos.
- **CA-9:** Al filtrar, la dirección refleja los filtros (por ejemplo `/?categoria=teatro&ciudad=Neiva`), y al abrir esa dirección la cartelera aparece ya filtrada, con los filtros marcados.
- **CA-10:** Si ningún evento cumple los filtros, la cartelera muestra «No hay eventos con esos filtros» y un enlace «Ver todos los eventos» que los quita.
- **CA-11:** Si la dirección trae una categoría que no existe, la cartelera la trata como «Todas».
- **CA-12:** La página `/eventos/{id}` muestra el título, la imagen, la descripción, la categoría, la ciudad, el lugar, la clasificación y la duración, y el enlace «Volver a la cartelera». Si el evento no existe muestra «No encontramos ese evento», y si el backend no responde, un mensaje con `role="alert"` que dice «No pudimos cargar el evento. Intenta de nuevo en unos minutos.».
- **CA-13:** La interfaz habla de eventos y no de películas: el subtítulo de la portada es «Elige tu evento y compra tus boletas.» y la dirección `/peliculas/1` ya no existe.
- **CA-14:** En 390 px y en 1280 px de ancho, en tema claro y oscuro, la cartelera y el detalle no tienen violaciones de axe de impacto serio o crítico ni errores de consola, y los filtros se pueden usar solo con el teclado.

## Fuera de alcance

- El filtro por fecha: va en la spec 003, cuando existan las funciones.
- Crear, editar o borrar eventos, y los roles de organizador y administrador.
- Redirigir las direcciones viejas de películas.

## Notas del dominio

- Un evento es algo a lo que se asiste con boleta: una película, una obra de teatro, un concierto o una charla. Se presenta en un lugar de una ciudad.
- La categoría reemplaza al género, y la sinopsis pasa a llamarse descripción.
- Los datos viven en memoria. Los de ejemplo traen al menos ocho eventos, de las cuatro categorías y de al menos dos ciudades, una de ellas Neiva.
- Es un cambio de nombres en los dos repositorios: entidad, rutas, tipos, componentes, pruebas y textos. No deben quedar restos de «película» en el código, salvo en los datos de ejemplo de la categoría cine.
- Las piezas de la interfaz salen de la skill `guia-visual`.
- Al cerrar la spec, el desarrollador actualiza los `AGENTS.md` de los dos repositorios, que todavía hablan de películas.
