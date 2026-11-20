# Spec 002 · Filtros de la cartelera con teclado

- **Fecha:** 19/11/2026, 7:29:40 p. m.
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
| 7 | Enter en «Filtrar» cambia la dirección | /?categoria=teatro&ciudad=Neiva | /?categoria=teatro&ciudad=Neiva | pasa |
| 8 | La cartelera queda filtrada | Cartas a Medianoche | Cartas a Medianoche | pasa |
| 9 | Los filtros quedan marcados | Teatro / Neiva | Teatro / Neiva | pasa |
| 10 | Filtros sin resultado | No hay eventos con esos filtros | No hay eventos con esos filtros | pasa |
| 11 | Tab llega a «Ver todos los eventos» | sí | sí | pasa |
| 12 | Enter en el enlace quita los filtros | / | / | pasa |
| 13 | Vuelven todos los eventos | 10 eventos | 10 eventos | pasa |
| 14 | Los filtros vuelven a «Todas» | Todas / Todas | Todas / Todas | pasa |
