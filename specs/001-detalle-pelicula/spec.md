# 001 · Detalle de película

- **Estado:** aprobada
- **Rama:** `feat/001-detalle-pelicula`
- **Repositorios:** frontend
- **Pull requests:** pendientes

## Por qué

La cartelera muestra el título, el género y la duración de cada película, pero no la sinopsis, y las tarjetas no llevan a ninguna parte. Sin una página por película no hay dónde mostrar después las funciones ni por dónde empezar una compra.

Además, el frontend no tiene pruebas automáticas. Sin ellas el arnés no puede aplicar TDD de ese lado, así que esta spec las deja instaladas.

## Qué se construye

Una página de detalle por película, a la que se llega desde la cartelera, y el framework de pruebas del frontend.

## Criterios de aceptación

- **CA-1:** En la cartelera, cada tarjeta es un enlace a `/peliculas/{id}` cuyo nombre accesible incluye el título de la película.
- **CA-2:** La página `/peliculas/{id}` de una película existente muestra el título como encabezado principal, el póster con el texto alternativo «Póster de {título}», la sinopsis, el género, la clasificación y la duración con el formato de la cartelera (118 minutos se muestra como «1 h 58 min»).
- **CA-3:** La página de detalle tiene un enlace «Volver a la cartelera» que lleva a `/`.
- **CA-4:** Si no existe una película con ese id, la página muestra «No encontramos esa película» y el enlace para volver a la cartelera.
- **CA-5:** Si el id no es un entero positivo (por ejemplo `/peliculas/abc` o `/peliculas/1.5`), la página se comporta como en CA-4.
- **CA-6:** Si el backend no responde, la página muestra un mensaje con `role="alert"` que dice «No pudimos cargar la película. Intenta de nuevo en unos minutos.», y no la pantalla de error de Next.
- **CA-7:** El título de la pestaña del navegador es «{título} · Taquillera».
- **CA-8:** En 390 px y en 1280 px de ancho, en tema claro y oscuro, la página no tiene violaciones de axe de impacto serio o crítico ni errores de consola.
- **CA-9:** El frontend tiene `npm test`, que ejecuta las pruebas con Vitest y Testing Library, y `npm run test:cov`, que falla si la cobertura de líneas baja del 80 %.

## Fuera de alcance

- Funciones y horarios de la película: van en la spec 002.
- Cambios en el backend: `GET /peliculas/:id` ya existe y responde lo necesario.
- Buscador o filtros en la cartelera.

## Notas del dominio

- La película tiene los campos que hoy responde el backend: `id`, `titulo`, `sinopsis`, `duracionMinutos`, `clasificacion`, `genero` e `imagenUrl`.
- CA-9 es una tarea habilitadora: instalar dependencias cambia `package.json` y requiere la aprobación del desarrollador.
