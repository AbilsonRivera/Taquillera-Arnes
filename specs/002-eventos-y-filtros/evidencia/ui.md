# Interfaz · informe del verificador-ui (T8)

Informe completo del `verificador-ui`, guardado tal cual lo entregó. El orquestador solo añade esta cabecera. Los archivos que produjo el script (capturas, `informe.md` e `informe.json`) están en `evidencia/ui/` y no se editaron.

- **Spec:** 002 · Eventos y filtros de la cartelera.
- **Estado del código que verificó:** backend en `bf2694b` y frontend en `4cc49e5` (con el `h1` del estado de error).
- **Comando:** `npm run verificar-ui -- --spec 002-eventos-y-filtros --rutas "inicio,?categoria=teatro&ciudad=Neiva,?categoria=charla&ciudad=Pitalito,?categoria=magia,eventos/4,eventos/9999"`, ejecutado una sola vez.
- **Verificado por el orquestador:** solo que el comando es el del plan. El orquestador no ha leído `evidencia/ui/informe.md` ni `informe.json` ni ha abierto las capturas: lo que sigue es lo que dice el verificador.

---

# Verificación de la interfaz · spec 002-eventos-y-filtros (T8)

**Resultado general: pasa.** El script terminó sin error y escribió «Resultado: pasa» con «Qué bloquea: Nada». Compiló y levantó los dos servidores y recorrió las seis rutas. Al final apagó ambos servidores. Comprobé con `curl` que los puertos 3000 y 3001 quedaron libres (conexión rechazada), así que no hizo falta `npm run servidores -- detener`.

Lo ejecuté una sola vez, con el comando exacto del encargo. Los archivos están en `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\specs\002-eventos-y-filtros\evidencia\ui\` (`informe.md` e `informe.json`).

## Resultado por ruta

| Ruta | Veredicto | Motivo |
|---|---|---|
| `inicio` | **pasa** | CA-7, CA-8 y CA-13 se cumplen, salvo el contenido de los desplegables, que no se ve (ver «Sin comprobar»). Subtítulo «Elige tu evento y compra tus boletas.». `h1` «Cartelera» y `h2` «En cartelera». Diez tarjetas (4+4+2 en 1280 px), cada una con título, «Categoría · Ciudad · duración» y la insignia (`+13`, `+7`, `TP`, `+16`). Cada tarjeta es un enlace a `/eventos/1` … `/eventos/10`, según el recorrido con Tab. Los dos filtros marcan «Todas» y está el botón «Filtrar». No aparece «película» en ninguna captura. |
| `?categoria=teatro&ciudad=Neiva` | **pasa** | CA-9. Los filtros muestran «Teatro» y «Neiva», con una sola tarjeta, «Cartas a Medianoche». |
| `?categoria=charla&ciudad=Pitalito` | **pasa** | CA-10. Los filtros muestran «Charla» y «Pitalito». Sale «No hay eventos con esos filtros» y el enlace «Ver todos los eventos», que lleva a `/` según el Tab. |
| `?categoria=magia` | **pasa** | CA-11. Los dos filtros marcan «Todas». Hay diez eventos y las mismas 13 paradas de Tab que `inicio`. |
| `eventos/4` | **pasa** | CA-12. `h1` «Cartas a Medianoche», afiche, descripción y el `<dl>` con Categoría, Ciudad, Lugar, Clasificación (`+13`) y Duración. Enlace «Volver a la cartelera». Título de pestaña: «Cartas a Medianoche · Taquillera». |
| `eventos/9999` | **pasa** | CA-12. `h1` «No encontramos ese evento» y el enlace «Volver a la cartelera». |
| **Backend apagado**, las seis rutas | **pasa** | Todas muestran un aviso con `role="alert"`. Ninguna sale en blanco ni con el error de Next. |

Todas las filas con los servidores encendidos (seis rutas × 390 y 1280 px × claro y oscuro, 24 visitas) dan:

- axe: 0 violaciones, sin ninguna de impacto `serious`, `critical`, `moderate` o `minor`.
- Consola: 0 errores.
- Peticiones fallidas: 0.
- Imágenes rotas: 0.
- Desborde horizontal: ninguno.
- Errores del servidor del frontend: ninguno.
- Bloqueos: ninguno.

### Textos de las alertas con el backend apagado (campo `alertas` de `informe.json`)

- Las cuatro rutas de la cartelera: «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.»
- `eventos/4` y `eventos/9999`: «No pudimos cargar el evento. Intenta de nuevo en unos minutos.»

En las capturas `eventos-4-sin-backend.png` y `eventos-9999-sin-backend.png` se ve «No pudimos cargar el evento» como título grande y, debajo, el aviso rojo con el texto exacto, como decidió Abilson (Desviaciones l). El script no registra los encabezados, así que confirmé el nivel `h1` en `frontend/src/components/DetalleEvento.tsx:38`. El estado de error se ve igual de bien que el resto: mismo tamaño de título que «No encontramos ese evento» y el aviso en las clases de «Mensaje de error» de la guía. En la cartelera no hay `h1` de error: el `h1` «Cartelera» y el `h2` «En cartelera» siguen visibles sobre el aviso, y los filtros se ocultan (D13).

### Títulos de pestaña (`informe.json`)

| Ruta | Título |
|---|---|
| `/` y las tres rutas con filtros | «Taquillera · Cartelera y venta de boletas» |
| `/eventos/4` | «Cartas a Medianoche · Taquillera» (el que pedía el encargo) |
| `/eventos/9999` | «Taquillera · Cartelera y venta de boletas» (genérico) |
| Con el backend apagado, todas las rutas incluida `/eventos/4` | «Taquillera · Cartelera y venta de boletas» |

## Recorrido con teclado (CA-14, punto 3)

Es a 1280 px. Los dos filtros y «Filtrar» aparecen en las cuatro rutas de la cartelera, en el orden Categoría, Ciudad, Filtrar y después las tarjetas. Todos tienen nombre y foco visible. No hay controles sin nombre ni controles de la spec a los que no se llegue.

### `/` (copiado tal cual)

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco |
|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí |
| 2 | select | «Ciudad» | — | sí |
| 3 | button | «Filtrar» | — | sí |
| 4 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí |
| 5 | a | «Galaxia Perdida +7 Cine · Bogotá · 2 h 12 min» | `/eventos/2` | sí |
| 6 | a | «Risas en Familia TP Cine · Pitalito · 1 h 35 min» | `/eventos/3` | sí |
| 7 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí |
| 8 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí |
| 9 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí |
| 10 | a | «Rock del Valle de Laboyos +16 Concierto · Pitalito · 2 h 30 min» | `/eventos/7` | sí |
| 11 | a | «Del Grano a la Taza TP Charla · Neiva · 1 h» | `/eventos/8` | sí |
| 12 | a | «Inteligencia Artificial sin Miedo TP Charla · Bogotá · 1 h 15 min» | `/eventos/9` | sí |
| 13 | a | «Historia del Huila en Cinco Objetos TP Charla · Íquira · 50 min» | `/eventos/10` | sí |

### `/?categoria=teatro&ciudad=Neiva`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco |
|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí |
| 2 | select | «Ciudad» | — | sí |
| 3 | button | «Filtrar» | — | sí |
| 4 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí |

### Las otras rutas

- **`/?categoria=charla&ciudad=Pitalito`:** paradas 1 a 3 iguales (Categoría, Ciudad, Filtrar) y la 4 es «Ver todos los eventos», que lleva a `/`.
- **`/?categoria=magia`:** igual que `/` (13 paradas).
- **`/eventos/4` y `/eventos/9999`:** una sola parada, «Volver a la cartelera», que lleva a `/`.

## Para el desarrollador humano (no bloquean)

1. **Los desplegables miden unos 41 px de alto y la guía pide 44.** En `inicio-categoria-teatro-ciudad-neiva-390-claro.png` van de y≈291 a y≈331; es una estimación sobre la captura. «Filtrar» mide unos 50 px y ocupa el ancho completo en 390 px. Las clases del `<select>` son las de «Campo de texto» de la guía (`px-3 py-2.5 text-base`, `FiltrosCartelera.tsx:12`).
   - Corrige: desarrollador-front, añadiendo `min-h-11`, o el desarrollador humano si prefiere cambiar la pieza en la guía.
   - A 1280 px el botón (50 px) y los desplegables (41 px) quedan alineados por abajo, con los bordes superiores unos 9 px desalineados.
2. **Insignia de clasificación (R10).** axe no marcó nada, pero el script solo guarda `violations` y no `incomplete`.
   - En el recorrido, el nombre de cada tarjeta trae «+13» y no «Clasificación +13».
   - El script no calcula el nombre accesible real: usa `aria-label` del propio elemento, luego `innerText` (`verificar-ui.mjs:150-158`), y por eso ignora el `aria-label` del `<span>` interno.
   - Por eso esta ejecución no demuestra que un lector de pantalla anuncie «Clasificación +13». Es la decisión de R10, de Abilson.
3. **`/eventos/9999` responde HTTP 200 y su pestaña tiene el título genérico.** La spec no pide 404 ni un título propio para ese estado. Solo lo informo.
4. **En el detalle a 390 px, la imagen mide 320 px y queda alineada a la izquierda** (`max-w-xs`), sin ocupar el ancho completo. Viene de 001.

Todo lo demás coincide con la guía:

- Etiquetas `<label>` visibles encima de los campos.
- «Filtrar» como botón secundario.
- Enlaces de texto con `min-h-11`.
- Tarjetas, mensaje de vacío y mensaje de error con las clases de la guía, y en oscuro sin colores nuevos.
- Texto legible en tema oscuro.

## Capturas que conviene mirar

Están todas en `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\specs\002-eventos-y-filtros\evidencia\ui\`.

- `inicio-categoria-teatro-ciudad-neiva-390-claro.png` y `-390-oscuro.png`: son las que muestran la altura de los desplegables y el botón de ancho completo.
- `inicio-categoria-charla-ciudad-pitalito-1280-oscuro.png` y `-390-claro.png`: el estado de vacío con su enlace.
- `eventos-4-sin-backend.png`, `eventos-9999-sin-backend.png` e `inicio-sin-backend.png`: el estado de error con su título y el aviso.
- `eventos-4-390-oscuro.png` y `eventos-9999-390-oscuro.png`: el detalle en el celular.
- `inicio-1280-claro.png` e `inicio-1280-oscuro.png`: la cartelera completa.

## Sin comprobar

- **La navegación en el cliente de `<Form>`.** Pulsar «Filtrar», que la dirección cambie sin recargar y que los desplegables se reinicien con la `key` (CA-9, R3, R12) no la ejercita el script, y no improvisé otro programa. Lo único visto en el navegador es que abrir la dirección filtrada marca los filtros y muestra el resultado correcto.
- **Elegir una opción con las flechas del teclado.** Tampoco la ejercita el script.
- **Las opciones de los desplegables (CA-8).** Las capturas solo muestran la opción marcada: «Todas», «Teatro», «Neiva», «Charla» y «Pitalito». No se ve que existan Cine, Concierto, Bogotá ni Íquira ni el orden. Lo respaldan el código de `FiltrosCartelera.tsx:42-65` y la prueba de componente, no el navegador.
- **El estado de error con el tema oscuro y a 390 px.** Las capturas con el backend apagado son solo de 1280 px en tema claro, y el script no ejecuta axe en ese estado. En el código tienen las variantes `dark:` de la guía, pero no las vi renderizadas.
- **Las tarjetas a 390 px de `inicio` y `magia` a tamaño real.** Esas capturas miden 390×7013 y las veo reducidas. La estructura general se ve bien: una columna, diez tarjetas y el formulario apilado con «Filtrar» a todo el ancho. El detalle del formulario a 390 px lo comprobé en las capturas de teatro y charla, que tienen el mismo formulario. Intenté recortar las capturas largas y el permiso lo rechazó.
- **Que el foco sea visible en pantalla.** Es solo la comprobación del script sobre el contorno calculado; no guarda capturas del foco.
- **El Grep de D17 (T9).** La herramienta Grep no está disponible aquí. Con `grep` sobre `frontend/src` solo aparecen coincidencias en `rutas.test.ts:11,16,18`, que D17 permite. Eso no sustituye la comprobación del revisor.

## Comandos que se negaron

1. Un comando de PowerShell con `System.Drawing` para recortar las capturas largas. El permiso lo rechazó («A variable in this command can't be checked before it runs») y no busqué otro camino.
2. `cd … && grep -n … herramientas/verificar-ui.mjs`, rechazado por usar una ruta relativa después de `cd`. Lo repetí solo, con la ruta absoluta, y funcionó.
3. La herramienta `Grep` no existe en este entorno (error de herramienta, no de permiso).

## Problemas con rol de corrección

- **Bloqueos: ninguno.**
- Desplegables de 41 px frente a los 44 px de la guía: desarrollador-front, o el desarrollador humano si se cambia la guía.
- Nombre accesible de la insignia y lo que mide el script (R10): decisión del desarrollador humano.
- Código HTTP y título de `/eventos/9999`: decisión del desarrollador humano. No hay incumplimiento de la spec.
