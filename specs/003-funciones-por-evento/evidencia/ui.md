# Interfaz · 003 Funciones por evento

Informes del `verificador-ui` (T8), copiados completos por el orquestador. Hay **tres vueltas**:

| Vuelta | Qué se midió | Resultado | Rama |
|---|---|---|---|
| **Primera** | Las ocho rutas de D18, a 390 y 1280 px, en tema claro y oscuro, y sin backend | pasa | backend `6017bd6`, frontend `3f7cdea` |
| **Segunda** | Solo `inicio` y `?fecha=2026-11-21`, después de alinear la fila de filtros con `h-12` (B-8) | pasa | backend `983f18a`, frontend `4559836` |
| **Tercera** | Las ocho rutas de D18 otra vez, sobre el código final, repetida por el desarrollador | pasa | backend y frontend de T10 (`4f3815e` y `b88075b`), con el mismo código de producción que `4559836` |

**Estado final de la evidencia.** La carpeta `evidencia/ui/` tiene **las 40 capturas, `informe.md` e `informe.json` de la tercera vuelta** (42 archivos). Las capturas de la primera y de la segunda vuelta fueron reemplazadas por las de la tercera (mismos nombres de archivo), y el `informe.md`/`informe.json` de las dos primeras también. **Los enlaces a capturas de los informes copiados abajo no están rotos: apuntan a los archivos de la tercera vuelta, que son los que existen.** El texto de las tres vueltas está completo en este documento.

Aparte, en `evidencia/interaccion.md` y `evidencia/interaccion/` están el resultado y las capturas de la prueba automática de teclado que hizo el desarrollador (M-3).

## Mi nota de cierre sobre las capturas (B-9)

Notas mías, Abilson Rivera Garcia, 19 de noviembre de 2026:

- **B-9, las capturas perdidas: la acepté.** Después de la segunda vuelta, las capturas de la primera se habían perdido porque el script vaciaba `evidencia/ui/` en cada pasada.
- **Cambié el script de verificación para que no vacíe la carpeta de evidencia:** ahora solo reemplaza las capturas de las direcciones que vuelve a visitar.
- **Después repetí la verificación con las ocho rutas sobre el código final:** «Resultado: pasa», sin bloqueos ni observaciones, y la carpeta `evidencia/ui` vuelve a tener las 40 capturas, con `informe.md` e `informe.json` de esa tercera pasada.
- Los cuatro controles de la fila de filtros miden 48 px, y las tres paradas internas del campo «Fecha» salen como «lo dibuja el navegador».
- **Corrijo la nota de los enlaces rotos:** ya no lo están.

**Nota del orquestador (qué comprobé en el disco).** `evidencia/ui/` tiene 42 archivos: 40 PNG (32 con backend, con nombre propio por ruta, ancho y tema; 8 sin backend), `informe.json` e `informe.md`. El `informe.md` es el de la tercera vuelta (fecha 19/11/2026, 10:05:44 p. m.): «Resultado: pasa», las ocho rutas con 0 de axe serias o críticas, 0 de otras de axe, 0 de consola, 0 peticiones fallidas y sin desborde, las ocho sin backend con su `role="alert"`, «Qué bloquea: Nada.» y «Observaciones que no bloquean: Ninguna.»; las filas del recorrido dicen 224 × 48 («Categoría», «Ciudad» y las cuatro paradas de «Fecha») y 87 × 48 («Filtrar») en las cinco rutas de la cartelera, y las paradas 4 a 6 de «Fecha» dicen «lo dibuja el navegador». `herramientas/verificar-ui.mjs:263-274` ya no vacía la carpeta: crea `evidencia/ui/` si no existe y solo borra las capturas cuyo nombre empieza por el prefijo de una dirección que se vuelve a visitar y termina en `{ancho}-{tema}.png` o `sin-backend.png`. **No ejecuté ni delegué esta tercera vuelta** (la repitió el desarrollador) y **no abrí las capturas nuevas**; lo que dice el informe es lo que midió el script.

---

# Primera vuelta

Ramas `feat/003-funciones-por-evento`: backend `6017bd6` y frontend `3f7cdea` (las puntas las confirmó el agente).

**Nota del orquestador.** Comprobé en el disco que `evidencia/ui/informe.md` decía «Resultado: pasa», «Qué bloquea: Nada.» y «Observaciones que no bloquean: Ninguna.», que había 42 archivos (40 PNG, `informe.json` e `informe.md`) y que las medidas de los cuatro controles de la sección 1 coincidían con las tablas del recorrido. No abrí las capturas: lo que dice la sección 5 es lo que vio el agente. Como ningún control medía menos de 44 px, **no se pidió ningún `fix:` ni se repitió T8 por esa razón**. El hallazgo 6.1 (cuarta parada de «Fecha» con foco «no») lo resolvió después el desarrollador (M-3): `verificar-ui.mjs:165` medía el contorno del propio elemento activo, que en las cuatro paradas es el mismo `input`. El hallazgo 6.2 (alturas 44/46/50) lo corrigió B-8, y por eso hubo segunda vuelta. **Las capturas de esta vuelta se reemplazaron después por las de la tercera** (mismos nombres).

## Veredicto

**T8 pasa.** El script terminó con «Resultado: pasa». No hay bloqueos, ningún control mide menos de 44 px y las ocho rutas se ven como pide la tabla «Recorrido que espera T8». Dejo tres hallazgos menores, ninguno bloqueante (sección 6). Los dos más relevantes son estos:

- «Fecha» sale **cuatro** veces con Tab, no «hasta tres» como suponía el plan, y la cuarta parada reporta «no» en el foco visible.
- A 1280 px la fila de filtros tiene alturas distintas (44, 46 y 50 px).

Las puntas de rama coinciden con el encargo: backend `6017bd6` y frontend `3f7cdea`.

## 1. Lo que pidió el desarrollador

### Medidas de los cuatro controles (copiadas del informe, a 1280 px)

El recorrido con Tab solo se hace a 1280 px. Las cinco rutas con filtros dan exactamente las mismas medidas.

| Ruta | «Categoría» (select) | «Ciudad» (select) | «Fecha» (input) | «Filtrar» (button) |
|---|---|---|---|---|
| `/` | 224 × 44 | 224 × 44 | 224 × 46 (las 4 paradas) | 87 × 50 |
| `/?fecha=2026-11-21` | 224 × 44 | 224 × 44 | 224 × 46 (las 4 paradas) | 87 × 50 |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 224 × 44 | 224 × 44 | 224 × 46 (las 4 paradas) | 87 × 50 |
| `/?fecha=2026-11-23` | 224 × 44 | 224 × 44 | 224 × 46 (las 4 paradas) | 87 × 50 |
| `/?fecha=2026-02-30` | 224 × 44 | 224 × 44 | 224 × 46 (las 4 paradas) | 87 × 50 |

Otros controles del informe:
- Tarjetas: 258 × 496.
- Enlaces de función: 190 × 50, 198 × 50, 190 × 50 en `eventos/4` y 189 × 50 en `eventos/8`.
- «Volver a la cartelera»: 124 × 44.
- «Ver todos los eventos»: 134 × 44.

### «Observaciones que no bloquean» (copiada tal cual)

```
## Observaciones que no bloquean

Ninguna.
```

### ¿Algún control mide menos de 44 px?

**No.** Los dos desplegables miden 44 de alto (el mínimo exacto de `min-h-11`), el campo «Fecha» 46 y «Filtrar» 50. Los enlaces de función miden 50, «Volver a la cartelera» y «Ver todos los eventos» 44, y las tarjetas 496. El control más angosto, «Filtrar», mide 87 px de ancho.

Con esto queda cerrado M1 de 002 (D22). Hay dos límites:
- El script mide solo a 1280 px.
- En las capturas a 390 px, leídas a ojo y no medidas, los controles ocupan una columna a todo el ancho con las mismas alturas, aproximadamente 44, 44, 46 y 50 px.

## 2. Resultado del script y bloqueos

- **Resultado: pasa.** Sección «Qué bloquea»: «Nada.».
- Las 32 visitas (8 rutas × 2 anchos × 2 temas) dan 0 violaciones de axe serias o críticas y 0 de otro impacto. También dan 0 errores de consola, 0 peticiones fallidas, sin desborde horizontal y estado 200.
- Los errores del servidor del frontend son «Ninguno.».
- No hay peticiones fallidas, así que no hubo precargas de `/funciones/…` (D16).

## 3. Capturas: cantidad y nombres

En `specs/003-funciones-por-evento/evidencia/ui/` había **42 archivos**: 40 PNG, `informe.json` e `informe.md`. Cada ruta tenía sus cuatro capturas con nombre propio, ninguna se pisaba y todos los nombres correspondían a su ruta. **(Esos archivos fueron reemplazados por los de la tercera vuelta, con los mismos nombres.)**

- `inicio-390-claro`, `inicio-390-oscuro`, `inicio-1280-claro`, `inicio-1280-oscuro`.
- Las de `?fecha=2026-11-21` son `inicio-fecha-2026-11-21-{390|1280}-{claro|oscuro}.png`, también cuatro.
- `?fecha=2026-11-23` y `?fecha=2026-02-30` siguen el mismo patrón: `inicio-fecha-2026-11-23-…` e `inicio-fecha-2026-02-30-…`.
- `inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-{390|1280}-{claro|oscuro}.png`, cuatro.
- `eventos-4-…`, `eventos-8-…` y `eventos-10-…`, cuatro cada una.
- Ocho más sin backend, una por ruta: `inicio-sin-backend`, `inicio-fecha-2026-11-21-sin-backend`, `inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-sin-backend`, `inicio-fecha-2026-11-23-sin-backend`, `inicio-fecha-2026-02-30-sin-backend`, `eventos-4-sin-backend`, `eventos-8-sin-backend` y `eventos-10-sin-backend`.

## 4. Revisión ruta por ruta

| Ruta | Veredicto | Qué se ve |
|---|---|---|
| `inicio` | pasa | 10 tarjetas y «Fecha» con el marcador `dd/mm/aaaa`. Tab: tres controles, «Fecha» ×4, «Filtrar» y 10 enlaces de `/eventos/1` a `/eventos/10`. |
| `?fecha=2026-11-21` | pasa | Tarjetas: El Último Faro, Cartas a Medianoche, El Inspector Distraído y Bambucos al Atardecer (1, 4, 5 y 6). «Fecha» muestra `21/11/2026`. Tab a `/eventos/1`, `/4`, `/5` y `/6`. |
| `?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | pasa | Una tarjeta, Cartas a Medianoche (4), y los tres filtros marcados: Teatro, Neiva y `22/11/2026`. Tab a `/eventos/4`. |
| `?fecha=2026-11-23` | pasa | «No hay eventos con esos filtros» y «Ver todos los eventos» (`/`). **No aparecen las tarjetas 4 y 7: el backend cuenta el día en hora de Colombia, no en UTC.** |
| `?fecha=2026-02-30` | pasa | 10 tarjetas, «Fecha» vacío (`dd/mm/aaaa`) y ningún aviso. |
| `eventos/4` | pasa | Ficha y «Funciones»: «sábado, 21 de noviembre» (4:00 p. m. y 11:30 p. m.) y «domingo, 22 de noviembre» (7:30 p. m.), las tres a «$ 25.000». Tab: «Volver…» y tres enlaces con nombre completo a `/funciones/5`, `/funciones/4` y `/funciones/3`. |
| `eventos/8` | pasa | «domingo, 22 de noviembre», «10:30 a. m.» y «$ 8.000». Enlace «domingo, 22 de noviembre, 10:30 a. m., $ 8.000» a `/funciones/10`. |
| `eventos/10` | pasa | «No hay funciones programadas» y solo «Volver a la cartelera» en el recorrido. |

**Veredicto por criterio**

| Criterio | Veredicto | Nota |
|---|---|---|
| CA-6 | pasa | Sección «Funciones» (`h2`) con un `h3` por día, escrito en español. |
| CA-7 | pasa | Horas en 12 horas con «a. m.» y «p. m.», y precios «$ 25.000» y «$ 8.000». |
| CA-8 | pasa | Los cuatro enlaces tienen nombre «día, hora, precio» y el destino esperado. |
| CA-9 | pasa | `eventos/10`. |
| CA-10 | no verificable aquí | El script no puede producir «evento sí, funciones no». Lo cubren las pruebas de Vitest. No lo marco como defecto. |
| CA-11 | pasa | Las cuatro rutas de filtro dan lo esperado, y la dirección y el campo «Fecha» coinciden. |
| CA-12 | pasa | 0 axe serias o críticas, 0 consola y 0 peticiones fallidas en los dos anchos y los dos temas. Todos los controles del recorrido tienen nombre. Ver 5 y 6 para los matices. |

**Recorrido con Tab:** las ocho tablas están completas en el informe copiado en la sección 10, y coinciden con las paradas de la tabla del plan. Detalles pedidos:
- «Categoría», «Ciudad» y «Filtrar» salen con su nombre y con foco visible en las cinco rutas de cartelera.
- «Fecha» sale **4 veces** por ruta. Las paradas 3, 4 y 5 tienen foco visible. La parada 6 dice «no» (ver 6.1).
- Ningún control queda «sin nombre».

**Sin backend:** las ocho rutas muestran un `role="alert"`. Las de cartelera dicen «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» y las de evento «No pudimos cargar el evento. Intenta de nuevo en unos minutos.». Ninguna queda en blanco ni muestra el error de Next.

## 5. Lo que veo en las capturas

Abrí `eventos-4-390-claro`, `eventos-4-1280-oscuro`, `inicio-fecha-2026-11-21-390-oscuro` (reducida al verla), `inicio-fecha-2026-11-21-1280-claro` y `-1280-oscuro`, `inicio-fecha-2026-11-23-1280-claro` y `eventos-10-390-claro`. Además: `inicio-categoria-…-1280-claro`, `inicio-categoria-…-390-oscuro`, `inicio-fecha-2026-02-30-1280-claro`, `eventos-8-390-oscuro`, `eventos-4-sin-backend` e `inicio-fecha-2026-11-23-sin-backend`.

- **Fila de filtros a 1280 px:** Categoría, Ciudad, Fecha y Filtrar caben en una fila (tres campos de 224 px y el botón), sin desborde ni solapes. A 390 px los cuatro se apilan a todo el ancho, sin desborde.
- **Campo de fecha en oscuro:** el icono del calendario se ve claro y legible a 390 y a 1280 px. El campo tiene fondo `zinc-900`, texto claro y borde visible.
- **Enlaces de función:** a 390 px los enlaces de `eventos/4` caben y se apilan (uno por fila, con la hora en negrita y el precio en gris). La hora y el precio se leen bien en claro y en oscuro. A 1280 px los dos del sábado van en la misma fila.
- **Orden de encabezados:** el orden es claro: `h1` del título, `h2` «Funciones» y `h3` por día. La jerarquía se nota más por el espacio que por el tamaño (ver 6.3).
- **Vacío de `eventos/10`:** «No hay funciones programadas» va en la caja del mensaje de vacío, bajo «Funciones».
- **Vacío de la cartelera:** «No hay eventos con esos filtros» lleva dentro el enlace «Ver todos los eventos».
- **Estado de error:** a 1280 px se ve el `h1` de error en `eventos/4` y el aviso rojo con su borde, legible.

## 6. Hallazgos (ninguno bloquea)

1. **«Fecha» sale 4 veces con Tab y la cuarta reporta foco «no» (baja).**
   - El plan suponía «hasta tres» (R4). Las paradas 3, 4 y 5 tienen foco visible. La 6, probablemente el botón del calendario, dice «no».
   - Dato: en las cuatro paradas el control activo es el mismo `input`. Que la cuarta sea el icono del calendario es mi deducción.
   - No lo puedo confirmar: las capturas no incluyen el foco y este script no lo muestra.
   - Qué hacer: el desarrollador humano comprueba a mano si el icono muestra un anillo (el propio navegador puede dibujarlo). Si no lo muestra, lo corrige el **desarrollador-front** en `frontend/src/components/FiltrosCartelera.tsx`, constante `CAMPO_FECHA`. El **planificador u orquestador** deben ajustar en el plan la nota R4 y la tabla de T8 («hasta cuatro»).
   - **Resuelto después por el desarrollador (M-3):** el icono sí muestra su anillo; ver `evidencia/interaccion.md`.
2. **Alturas desiguales en la fila de filtros a 1280 px (baja, visual).**
   - Los desplegables miden 44, el campo «Fecha» 46 y «Filtrar» 50, alineados por abajo (`items-end`).
   - Resultado: la etiqueta «Fecha» queda unos 2 px más arriba que «Categoría» y «Ciudad», y el botón sobresale un poco por arriba de los campos. Todos cumplen los 44 px.
   - Si el desarrollador humano lo quiere parejo, el cambio es del **desarrollador-front**, en el mismo archivo.
   - **Resuelto después (B-8, `h-12`): ver la segunda y la tercera vuelta.**
3. **`h2` y `h3` de tamaño parecido (informativa).** Son `text-xl` y `text-lg`, que es lo que pide la guía. No hay nada que corregir.
4. **Cartelera sin backend sin formulario (informativa, de 002).** Con el backend apagado, la cartelera muestra el aviso y no el formulario de filtros. No es de esta spec.

## 7. Piezas de la guía (D19)

Leí el código de los componentes para contrastarlo con la guía, y no encuentro desvíos.

- **Campo de fecha:** `FiltrosCartelera.tsx` usa las clases de «Campo de texto» más `dark:scheme-dark`. Lleva `<label>` visible y foco de teclado.
- **Etiqueta, desplegables y botón:** la etiqueta, los desplegables y el botón «Filtrar» (secundario, con `w-full` y `sm:w-auto` añadidos) coinciden con la guía.
- **Subtítulo (h3), error y vacío:** `FuncionesEvento.tsx` usa `text-lg font-semibold…` para el `h3`, y las clases de «Mensaje de error» (`role="alert"`) y de «Mensaje de vacío».
- **Enlaces de función:** llevan las clases de «Botón secundario» más `inline-flex min-h-11 items-center gap-3`, tal como dice D19. El precio usa el texto secundario.
- **«Volver a la cartelera»:** `DetalleEvento.tsx` suma `inline-flex min-h-11 items-center` al «Enlace de texto». Esa fila de la guía no trae `min-h-11`. Es coherente con la regla de 44 px, y la guía podría anotarlo.
- **«Ver todos los eventos»:** solo vi su altura (44 px), no su código.

## 8. Lo que el navegador no puede ver

- **CA-10:** el estado «el evento carga y las funciones no» no se puede producir con este script, y «Cargando funciones…» tampoco se ve en las capturas.
- **Axe con el backend apagado:** no se ejecuta, y no lo marco como defecto.
- **Calendario desplegado:** no sale en las capturas.
- **`<Suspense>` real de `page.tsx`:** lo ve la lectura del revisor (T9), no este informe.

## 9. Instrucciones encontradas

Ninguna en páginas, informes ni archivos leídos. El bloque «This is NOT the Next.js you know» de `frontend/AGENTS.md` no es una instrucción para este rol, y no lo seguí.

## 10. Texto completo de `evidencia/ui/informe.md` (primera vuelta)

```markdown
# Verificación de interfaz · 003-funciones-por-evento

- **Fecha:** 19/11/2026, 8:44:52 p. m.
- **Resultado:** pasa

## Con los dos servidores encendidos

| Ruta | Ancho | Tema | Estado | Axe serias o críticas | Otras de axe | Consola | Peticiones fallidas | Desborde | Captura |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-claro.png](inicio-390-claro.png) |
| `/` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-oscuro.png](inicio-390-oscuro.png) |
| `/` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-claro.png](inicio-1280-claro.png) |
| `/` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-oscuro.png](inicio-1280-oscuro.png) |
| `/?fecha=2026-11-21` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-390-claro.png](inicio-fecha-2026-11-21-390-claro.png) |
| `/?fecha=2026-11-21` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-390-oscuro.png](inicio-fecha-2026-11-21-390-oscuro.png) |
| `/?fecha=2026-11-21` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-1280-claro.png](inicio-fecha-2026-11-21-1280-claro.png) |
| `/?fecha=2026-11-21` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-1280-oscuro.png](inicio-fecha-2026-11-21-1280-oscuro.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-390-claro.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-390-claro.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-390-oscuro.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-390-oscuro.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-1280-claro.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-1280-claro.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-1280-oscuro.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-1280-oscuro.png) |
| `/?fecha=2026-11-23` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-23-390-claro.png](inicio-fecha-2026-11-23-390-claro.png) |
| `/?fecha=2026-11-23` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-23-390-oscuro.png](inicio-fecha-2026-11-23-390-oscuro.png) |
| `/?fecha=2026-11-23` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-23-1280-claro.png](inicio-fecha-2026-11-23-1280-claro.png) |
| `/?fecha=2026-11-23` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-23-1280-oscuro.png](inicio-fecha-2026-11-23-1280-oscuro.png) |
| `/?fecha=2026-02-30` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-02-30-390-claro.png](inicio-fecha-2026-02-30-390-claro.png) |
| `/?fecha=2026-02-30` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-02-30-390-oscuro.png](inicio-fecha-2026-02-30-390-oscuro.png) |
| `/?fecha=2026-02-30` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-02-30-1280-claro.png](inicio-fecha-2026-02-30-1280-claro.png) |
| `/?fecha=2026-02-30` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-02-30-1280-oscuro.png](inicio-fecha-2026-02-30-1280-oscuro.png) |
| `/eventos/4` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-390-claro.png](eventos-4-390-claro.png) |
| `/eventos/4` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-390-oscuro.png](eventos-4-390-oscuro.png) |
| `/eventos/4` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-1280-claro.png](eventos-4-1280-claro.png) |
| `/eventos/4` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-1280-oscuro.png](eventos-4-1280-oscuro.png) |
| `/eventos/8` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-8-390-claro.png](eventos-8-390-claro.png) |
| `/eventos/8` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-8-390-oscuro.png](eventos-8-390-oscuro.png) |
| `/eventos/8` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-8-1280-claro.png](eventos-8-1280-claro.png) |
| `/eventos/8` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-8-1280-oscuro.png](eventos-8-1280-oscuro.png) |
| `/eventos/10` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-10-390-claro.png](eventos-10-390-claro.png) |
| `/eventos/10` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-10-390-oscuro.png](eventos-10-390-oscuro.png) |
| `/eventos/10` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-10-1280-claro.png](eventos-10-1280-claro.png) |
| `/eventos/10` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-10-1280-oscuro.png](eventos-10-1280-oscuro.png) |

## Con el backend apagado

| Ruta | Estado | Mensajes con role="alert" | Captura |
|---|---|---|---|
| `/` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-sin-backend.png](inicio-sin-backend.png) |
| `/?fecha=2026-11-21` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-fecha-2026-11-21-sin-backend.png](inicio-fecha-2026-11-21-sin-backend.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-sin-backend.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-sin-backend.png) |
| `/?fecha=2026-11-23` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-fecha-2026-11-23-sin-backend.png](inicio-fecha-2026-11-23-sin-backend.png) |
| `/?fecha=2026-02-30` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-fecha-2026-02-30-sin-backend.png](inicio-fecha-2026-02-30-sin-backend.png) |
| `/eventos/4` | 200 | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» | [eventos-4-sin-backend.png](eventos-4-sin-backend.png) |
| `/eventos/8` | 200 | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» | [eventos-8-sin-backend.png](eventos-8-sin-backend.png) |
| `/eventos/10` | 200 | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» | [eventos-10-sin-backend.png](eventos-10-sin-backend.png) |

## Recorrido con teclado

Cada fila es una parada de la tecla Tab, en orden, a 1280 px.

### `/`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 44 |
| 2 | select | «Ciudad» | — | sí | 224 × 44 |
| 3 | input | «Fecha» | — | sí | 224 × 46 |
| 4 | input | «Fecha» | — | sí | 224 × 46 |
| 5 | input | «Fecha» | — | sí | 224 × 46 |
| 6 | input | «Fecha» | — | no | 224 × 46 |
| 7 | button | «Filtrar» | — | sí | 87 × 50 |
| 8 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí | 258 × 496 |
| 9 | a | «Galaxia Perdida +7 Cine · Bogotá · 2 h 12 min» | `/eventos/2` | sí | 258 × 496 |
| 10 | a | «Risas en Familia TP Cine · Pitalito · 1 h 35 min» | `/eventos/3` | sí | 258 × 496 |
| 11 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |
| 12 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí | 258 × 496 |
| 13 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí | 258 × 496 |
| 14 | a | «Rock del Valle de Laboyos +16 Concierto · Pitalito · 2 h 30 min» | `/eventos/7` | sí | 258 × 496 |
| 15 | a | «Del Grano a la Taza TP Charla · Neiva · 1 h» | `/eventos/8` | sí | 258 × 496 |
| 16 | a | «Inteligencia Artificial sin Miedo TP Charla · Bogotá · 1 h 15 min» | `/eventos/9` | sí | 258 × 496 |
| 17 | a | «Historia del Huila en Cinco Objetos TP Charla · Íquira · 50 min» | `/eventos/10` | sí | 258 × 496 |

### `/?fecha=2026-11-21`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 44 |
| 2 | select | «Ciudad» | — | sí | 224 × 44 |
| 3 | input | «Fecha» | — | sí | 224 × 46 |
| 4 | input | «Fecha» | — | sí | 224 × 46 |
| 5 | input | «Fecha» | — | sí | 224 × 46 |
| 6 | input | «Fecha» | — | no | 224 × 46 |
| 7 | button | «Filtrar» | — | sí | 87 × 50 |
| 8 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí | 258 × 496 |
| 9 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |
| 10 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí | 258 × 496 |
| 11 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí | 258 × 496 |

### `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 44 |
| 2 | select | «Ciudad» | — | sí | 224 × 44 |
| 3 | input | «Fecha» | — | sí | 224 × 46 |
| 4 | input | «Fecha» | — | sí | 224 × 46 |
| 5 | input | «Fecha» | — | sí | 224 × 46 |
| 6 | input | «Fecha» | — | no | 224 × 46 |
| 7 | button | «Filtrar» | — | sí | 87 × 50 |
| 8 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |

### `/?fecha=2026-11-23`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 44 |
| 2 | select | «Ciudad» | — | sí | 224 × 44 |
| 3 | input | «Fecha» | — | sí | 224 × 46 |
| 4 | input | «Fecha» | — | sí | 224 × 46 |
| 5 | input | «Fecha» | — | sí | 224 × 46 |
| 6 | input | «Fecha» | — | no | 224 × 46 |
| 7 | button | «Filtrar» | — | sí | 87 × 50 |
| 8 | a | «Ver todos los eventos» | `/` | sí | 134 × 44 |

### `/?fecha=2026-02-30`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 44 |
| 2 | select | «Ciudad» | — | sí | 224 × 44 |
| 3 | input | «Fecha» | — | sí | 224 × 46 |
| 4 | input | «Fecha» | — | sí | 224 × 46 |
| 5 | input | «Fecha» | — | sí | 224 × 46 |
| 6 | input | «Fecha» | — | no | 224 × 46 |
| 7 | button | «Filtrar» | — | sí | 87 × 50 |
| 8 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí | 258 × 496 |
| 9 | a | «Galaxia Perdida +7 Cine · Bogotá · 2 h 12 min» | `/eventos/2` | sí | 258 × 496 |
| 10 | a | «Risas en Familia TP Cine · Pitalito · 1 h 35 min» | `/eventos/3` | sí | 258 × 496 |
| 11 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |
| 12 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí | 258 × 496 |
| 13 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí | 258 × 496 |
| 14 | a | «Rock del Valle de Laboyos +16 Concierto · Pitalito · 2 h 30 min» | `/eventos/7` | sí | 258 × 496 |
| 15 | a | «Del Grano a la Taza TP Charla · Neiva · 1 h» | `/eventos/8` | sí | 258 × 496 |
| 16 | a | «Inteligencia Artificial sin Miedo TP Charla · Bogotá · 1 h 15 min» | `/eventos/9` | sí | 258 × 496 |
| 17 | a | «Historia del Huila en Cinco Objetos TP Charla · Íquira · 50 min» | `/eventos/10` | sí | 258 × 496 |

### `/eventos/4`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | a | «sábado, 21 de noviembre, 4:00 p. m., $ 25.000» | `/funciones/5` | sí | 190 × 50 |
| 3 | a | «sábado, 21 de noviembre, 11:30 p. m., $ 25.000» | `/funciones/4` | sí | 198 × 50 |
| 4 | a | «domingo, 22 de noviembre, 7:30 p. m., $ 25.000» | `/funciones/3` | sí | 190 × 50 |

### `/eventos/8`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | a | «domingo, 22 de noviembre, 10:30 a. m., $ 8.000» | `/funciones/10` | sí | 189 × 50 |

### `/eventos/10`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |

## Errores del servidor del frontend

Ninguno.

## Qué bloquea

Nada.

## Observaciones que no bloquean

Ninguna.

El detalle completo, con cada violación de axe y cada mensaje de consola, está en `informe.json`.
```

---

# Segunda vuelta

Solo con `inicio` y `?fecha=2026-11-21`, después del commit `fix: alinear con h-12 los controles de la fila de filtros` (B-8). Ramas: backend `983f18a` y frontend `4559836` (sobre `refactor:` `e2e1777` y `test:` `0178e84`).

**Nota del orquestador.** Comprobé en el disco que `evidencia/ui/informe.md` (de las 9:31:57 p. m.) decía «Resultado: pasa», «Qué bloquea: Nada.» y «Observaciones que no bloquean: Ninguna.»; que las filas del recorrido de las dos rutas decían 224 × 48 («Categoría», «Ciudad» y las cuatro paradas de «Fecha») y 87 × 48 («Filtrar»); que las paradas internas de «Fecha» decían «lo dibuja el navegador»; y que `evidencia/ui/` tenía entonces **12 archivos** (10 PNG, `informe.json` e `informe.md`). Las puntas de rama las comprobé yo (el agente no pudo: los `git -C … log/branch/status` le pidieron aprobación y no buscó otro camino). **No abrí las capturas de esta vuelta;** lo que dice la sección «Lo que veo en las capturas» es lo que vio el agente (el revisor abrió `inicio-fecha-2026-11-21-1280-claro.png` e `inicio-390-oscuro.png` y lo confirmó). El agente anota que a 390 px las capturas se mostraron reducidas y no distingue diferencias de uno o dos píxeles. **Las capturas y el informe de esta vuelta fueron reemplazados después por los de la tercera.**

## Veredicto

**T8 pasa.** El script terminó con «Resultado: pasa». «Qué bloquea» dice «Nada.» y «Observaciones que no bloquean» dice «Ninguna.».

**Los cuatro controles de la fila de filtros miden 48 px de alto**, en las dos rutas. No hay nada que corregir en `frontend/src/components/FiltrosCartelera.tsx`.

No pude confirmar las puntas de rama (`4559836` en el frontend y `983f18a` en el backend). Los cuatro comandos `git -C … log/branch/status` pidieron aprobación y no busqué otro camino. El código del componente sí tiene el cambio esperado: `h-12` en `DESPLEGABLE`, que usan los dos `<select>` y `CAMPO_FECHA`, y en `BOTON_SECUNDARIO`, sin `min-h-11` y sin `py-3` en el botón.

## Medidas copiadas del recorrido con Tab (1280 px)

Las dos rutas dan lo mismo.

| Control | `/` | `/?fecha=2026-11-21` |
|---|---|---|
| «Categoría» (select) | 224 × 48 | 224 × 48 |
| «Ciudad» (select) | 224 × 48 | 224 × 48 |
| «Fecha» (input), las 4 paradas | 224 × 48 | 224 × 48 |
| «Filtrar» (button) | 87 × 48 | 87 × 48 |

Antes de la corrección eran 44, 44, 46 y 50 px.

## Paradas internas de «Fecha»

«Fecha» tiene **4 paradas** con Tab, en las dos rutas (filas 3 a 6). Las tres últimas ya dicen «lo dibuja el navegador», y las cuatro se anuncian como «Fecha»:

```
| 3 | input | «Fecha» | — | sí | 224 × 48 |
| 4 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 5 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 6 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
```

## Lo que veo en las capturas

Abrí `inicio-1280-claro`, `inicio-fecha-2026-11-21-1280-claro`, `inicio-fecha-2026-11-21-1280-oscuro`, `inicio-fecha-2026-11-21-390-claro`, `inicio-fecha-2026-11-21-390-oscuro` e `inicio-fecha-2026-11-21-sin-backend`.

- **Etiqueta «Fecha»:** a 1280 px queda a la misma altura que «Categoría» y «Ciudad». Las tres etiquetas están en la misma línea, y ya no se ve el desfase de unos 2 px de la primera vuelta.
- **Bordes de los cuatro controles:** el borde superior y el inferior coinciden. Los dos desplegables, el campo de fecha y el botón «Filtrar» van de la misma altura y el botón ya no sobresale. Es igual en claro y en oscuro, con y sin fecha elegida.
- **Texto «Filtrar»:** se ve entero y centrado en vertical a 1280 y a 390 px, sin recorte. A 1280 px queda a la misma altura que «Todas» y que el texto del campo de fecha.
- **Icono del calendario en oscuro:** el icono se ve claro y legible a 1280 y a 390 px. El campo tiene fondo oscuro, texto claro y borde visible.
- **A 390 px:** los cuatro controles se apilan en una columna a todo el ancho, sin desborde y sin solapes. A ojo, los cuatro miden unos 48 px de alto, igual que a 1280 px.
- **Sin backend:** se ve el título de la cartelera y un aviso rojo con el texto «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.». No hay pantalla en blanco ni error de Next.
- **Nombres de archivo:** todos corresponden a su ruta.

## Hallazgos

Ninguno bloquea.

1. **Las tres paradas internas de «Fecha» siguen sin medirse (baja, informativa).** El cambio de «no» a «lo dibuja el navegador» es una etiqueta del script, no una comprobación. Las capturas tampoco incluyen el foco. Si el icono del calendario muestra un anillo, lo tiene que mirar a mano el desarrollador humano. *(Lo comprobó el desarrollador con la prueba automática de teclado de `evidencia/interaccion.md`, que el agente no leyó.)*
2. **La guía no refleja la excepción del botón (informativa).** La fila «Botón secundario» de `.claude/skills/guia-visual/SKILL.md` conserva `py-3`, y el componente lo quita al usar `h-12`. La regla de la línea 52 y el comentario del componente lo explican. La guía podría anotar que en una fila de formulario el botón lleva `h-12` en lugar de `py-3`. Lo decide el desarrollador humano. *(La regla está ahora en `SKILL.md:57`; el agente la leyó en la línea 52, antes de un cambio posterior de la guía. El desarrollador confirmó al cerrar que la guía tiene la regla.)*
3. **Cartelera sin backend sin formulario ni enlace de salida (informativa, de 002).** Con el backend apagado solo sale el aviso. Ya estaba como 6.4 en la primera vuelta.

**Límites:**
- El script mide los controles solo a 1280 px. A 390 px la altura de 48 px es una estimación a ojo, coherente con `h-12`, que no tiene variante responsive.
- El visor mostró las capturas de 390 px reducidas a 243 px de ancho. Se ve que no hay recortes ni desborde, pero no distingo diferencias de uno o dos píxeles.

## Instrucciones encontradas

Ninguna en páginas, informes ni archivos leídos. El bloque «This is NOT the Next.js you know» de `frontend/AGENTS.md` no es una instrucción para este rol y no lo seguí.

## Archivos en `evidencia/ui/` (en aquel momento)

Había **12**: 10 PNG, `informe.json` e `informe.md`. Los nombres de las capturas eran:

- `inicio-390-claro.png`, `inicio-390-oscuro.png`, `inicio-1280-claro.png`, `inicio-1280-oscuro.png`
- `inicio-fecha-2026-11-21-390-claro.png`, `inicio-fecha-2026-11-21-390-oscuro.png`, `inicio-fecha-2026-11-21-1280-claro.png`, `inicio-fecha-2026-11-21-1280-oscuro.png`
- `inicio-sin-backend.png`, `inicio-fecha-2026-11-21-sin-backend.png`

## Texto completo de `evidencia/ui/informe.md` (segunda vuelta)

```markdown
# Verificación de interfaz · 003-funciones-por-evento

- **Fecha:** 19/11/2026, 9:31:57 p. m.
- **Resultado:** pasa

## Con los dos servidores encendidos

| Ruta | Ancho | Tema | Estado | Axe serias o críticas | Otras de axe | Consola | Peticiones fallidas | Desborde | Captura |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-claro.png](inicio-390-claro.png) |
| `/` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-oscuro.png](inicio-390-oscuro.png) |
| `/` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-claro.png](inicio-1280-claro.png) |
| `/` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-oscuro.png](inicio-1280-oscuro.png) |
| `/?fecha=2026-11-21` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-390-claro.png](inicio-fecha-2026-11-21-390-claro.png) |
| `/?fecha=2026-11-21` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-390-oscuro.png](inicio-fecha-2026-11-21-390-oscuro.png) |
| `/?fecha=2026-11-21` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-1280-claro.png](inicio-fecha-2026-11-21-1280-claro.png) |
| `/?fecha=2026-11-21` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-1280-oscuro.png](inicio-fecha-2026-11-21-1280-oscuro.png) |

## Con el backend apagado

| Ruta | Estado | Mensajes con role="alert" | Captura |
|---|---|---|---|
| `/` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-sin-backend.png](inicio-sin-backend.png) |
| `/?fecha=2026-11-21` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-fecha-2026-11-21-sin-backend.png](inicio-fecha-2026-11-21-sin-backend.png) |

## Recorrido con teclado

Cada fila es una parada de la tecla Tab, en orden, a 1280 px.

### `/`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 48 |
| 2 | select | «Ciudad» | — | sí | 224 × 48 |
| 3 | input | «Fecha» | — | sí | 224 × 48 |
| 4 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 5 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 6 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 7 | button | «Filtrar» | — | sí | 87 × 48 |
| 8 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí | 258 × 496 |
| 9 | a | «Galaxia Perdida +7 Cine · Bogotá · 2 h 12 min» | `/eventos/2` | sí | 258 × 496 |
| 10 | a | «Risas en Familia TP Cine · Pitalito · 1 h 35 min» | `/eventos/3` | sí | 258 × 496 |
| 11 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |
| 12 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí | 258 × 496 |
| 13 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí | 258 × 496 |
| 14 | a | «Rock del Valle de Laboyos +16 Concierto · Pitalito · 2 h 30 min» | `/eventos/7` | sí | 258 × 496 |
| 15 | a | «Del Grano a la Taza TP Charla · Neiva · 1 h» | `/eventos/8` | sí | 258 × 496 |
| 16 | a | «Inteligencia Artificial sin Miedo TP Charla · Bogotá · 1 h 15 min» | `/eventos/9` | sí | 258 × 496 |
| 17 | a | «Historia del Huila en Cinco Objetos TP Charla · Íquira · 50 min» | `/eventos/10` | sí | 258 × 496 |

### `/?fecha=2026-11-21`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 48 |
| 2 | select | «Ciudad» | — | sí | 224 × 48 |
| 3 | input | «Fecha» | — | sí | 224 × 48 |
| 4 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 5 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 6 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 7 | button | «Filtrar» | — | sí | 87 × 48 |
| 8 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí | 258 × 496 |
| 9 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |
| 10 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí | 258 × 496 |
| 11 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí | 258 × 496 |

## Errores del servidor del frontend

Ninguno.

## Qué bloquea

Nada.

## Observaciones que no bloquean

Ninguna.

El detalle completo, con cada violación de axe y cada mensaje de consola, está en `informe.json`.
```

---

# Tercera vuelta

Las ocho rutas de D18 otra vez, sobre el código final, **repetida por el desarrollador** después de cambiar el script para que no vacíe `evidencia/ui/` (B-9). Fecha del informe: 19/11/2026, 10:05:44 p. m. Código de producción igual que en `4559836` (los commits posteriores de T10 son `style:` y `docs:`). **Este es el `informe.md` que está hoy en `evidencia/ui/`, con sus 40 capturas.**

**Nota del orquestador.** No ejecuté ni delegué esta vuelta: la repitió el desarrollador y yo copio el `informe.md` que dejó el script, que leí completo en el disco. Lo que leí: «Resultado: pasa»; 32 visitas con 0 de axe serias o críticas, 0 de otras de axe, 0 de consola, 0 peticiones fallidas y sin desborde; las ocho rutas sin backend con su `role="alert"`; las ocho tablas del recorrido, con los cuatro controles de la fila de filtros en 48 px (224 × 48 y 87 × 48) en las cinco rutas de la cartelera y las paradas 4 a 6 de «Fecha» con «lo dibuja el navegador»; «Errores del servidor del frontend: Ninguno.»; «Qué bloquea: Nada.»; «Observaciones que no bloquean: Ninguna.». Los demás controles (tarjetas 258 × 496, enlaces de función de 189 a 198 × 50, «Volver a la cartelera» 124 × 44 y «Ver todos los eventos» 134 × 44) siguen como en la primera vuelta. **No abrí las capturas.**

## Texto completo de `evidencia/ui/informe.md` (tercera vuelta)

```markdown
# Verificación de interfaz · 003-funciones-por-evento

- **Fecha:** 19/11/2026, 10:05:44 p. m.
- **Resultado:** pasa

## Con los dos servidores encendidos

| Ruta | Ancho | Tema | Estado | Axe serias o críticas | Otras de axe | Consola | Peticiones fallidas | Desborde | Captura |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-claro.png](inicio-390-claro.png) |
| `/` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-oscuro.png](inicio-390-oscuro.png) |
| `/` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-claro.png](inicio-1280-claro.png) |
| `/` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-oscuro.png](inicio-1280-oscuro.png) |
| `/?fecha=2026-11-21` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-390-claro.png](inicio-fecha-2026-11-21-390-claro.png) |
| `/?fecha=2026-11-21` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-390-oscuro.png](inicio-fecha-2026-11-21-390-oscuro.png) |
| `/?fecha=2026-11-21` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-1280-claro.png](inicio-fecha-2026-11-21-1280-claro.png) |
| `/?fecha=2026-11-21` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-21-1280-oscuro.png](inicio-fecha-2026-11-21-1280-oscuro.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-390-claro.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-390-claro.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-390-oscuro.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-390-oscuro.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-1280-claro.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-1280-claro.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-1280-oscuro.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-1280-oscuro.png) |
| `/?fecha=2026-11-23` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-23-390-claro.png](inicio-fecha-2026-11-23-390-claro.png) |
| `/?fecha=2026-11-23` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-23-390-oscuro.png](inicio-fecha-2026-11-23-390-oscuro.png) |
| `/?fecha=2026-11-23` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-23-1280-claro.png](inicio-fecha-2026-11-23-1280-claro.png) |
| `/?fecha=2026-11-23` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-11-23-1280-oscuro.png](inicio-fecha-2026-11-23-1280-oscuro.png) |
| `/?fecha=2026-02-30` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-02-30-390-claro.png](inicio-fecha-2026-02-30-390-claro.png) |
| `/?fecha=2026-02-30` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-02-30-390-oscuro.png](inicio-fecha-2026-02-30-390-oscuro.png) |
| `/?fecha=2026-02-30` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-02-30-1280-claro.png](inicio-fecha-2026-02-30-1280-claro.png) |
| `/?fecha=2026-02-30` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-fecha-2026-02-30-1280-oscuro.png](inicio-fecha-2026-02-30-1280-oscuro.png) |
| `/eventos/4` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-390-claro.png](eventos-4-390-claro.png) |
| `/eventos/4` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-390-oscuro.png](eventos-4-390-oscuro.png) |
| `/eventos/4` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-1280-claro.png](eventos-4-1280-claro.png) |
| `/eventos/4` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-1280-oscuro.png](eventos-4-1280-oscuro.png) |
| `/eventos/8` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-8-390-claro.png](eventos-8-390-claro.png) |
| `/eventos/8` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-8-390-oscuro.png](eventos-8-390-oscuro.png) |
| `/eventos/8` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-8-1280-claro.png](eventos-8-1280-claro.png) |
| `/eventos/8` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-8-1280-oscuro.png](eventos-8-1280-oscuro.png) |
| `/eventos/10` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-10-390-claro.png](eventos-10-390-claro.png) |
| `/eventos/10` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-10-390-oscuro.png](eventos-10-390-oscuro.png) |
| `/eventos/10` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-10-1280-claro.png](eventos-10-1280-claro.png) |
| `/eventos/10` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-10-1280-oscuro.png](eventos-10-1280-oscuro.png) |

## Con el backend apagado

| Ruta | Estado | Mensajes con role="alert" | Captura |
|---|---|---|---|
| `/` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-sin-backend.png](inicio-sin-backend.png) |
| `/?fecha=2026-11-21` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-fecha-2026-11-21-sin-backend.png](inicio-fecha-2026-11-21-sin-backend.png) |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-sin-backend.png](inicio-categoria-teatro-ciudad-neiva-fecha-2026-11-22-sin-backend.png) |
| `/?fecha=2026-11-23` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-fecha-2026-11-23-sin-backend.png](inicio-fecha-2026-11-23-sin-backend.png) |
| `/?fecha=2026-02-30` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-fecha-2026-02-30-sin-backend.png](inicio-fecha-2026-02-30-sin-backend.png) |
| `/eventos/4` | 200 | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» | [eventos-4-sin-backend.png](eventos-4-sin-backend.png) |
| `/eventos/8` | 200 | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» | [eventos-8-sin-backend.png](eventos-8-sin-backend.png) |
| `/eventos/10` | 200 | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» | [eventos-10-sin-backend.png](eventos-10-sin-backend.png) |

## Recorrido con teclado

Cada fila es una parada de la tecla Tab, en orden, a 1280 px.

### `/`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 48 |
| 2 | select | «Ciudad» | — | sí | 224 × 48 |
| 3 | input | «Fecha» | — | sí | 224 × 48 |
| 4 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 5 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 6 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 7 | button | «Filtrar» | — | sí | 87 × 48 |
| 8 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí | 258 × 496 |
| 9 | a | «Galaxia Perdida +7 Cine · Bogotá · 2 h 12 min» | `/eventos/2` | sí | 258 × 496 |
| 10 | a | «Risas en Familia TP Cine · Pitalito · 1 h 35 min» | `/eventos/3` | sí | 258 × 496 |
| 11 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |
| 12 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí | 258 × 496 |
| 13 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí | 258 × 496 |
| 14 | a | «Rock del Valle de Laboyos +16 Concierto · Pitalito · 2 h 30 min» | `/eventos/7` | sí | 258 × 496 |
| 15 | a | «Del Grano a la Taza TP Charla · Neiva · 1 h» | `/eventos/8` | sí | 258 × 496 |
| 16 | a | «Inteligencia Artificial sin Miedo TP Charla · Bogotá · 1 h 15 min» | `/eventos/9` | sí | 258 × 496 |
| 17 | a | «Historia del Huila en Cinco Objetos TP Charla · Íquira · 50 min» | `/eventos/10` | sí | 258 × 496 |

### `/?fecha=2026-11-21`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 48 |
| 2 | select | «Ciudad» | — | sí | 224 × 48 |
| 3 | input | «Fecha» | — | sí | 224 × 48 |
| 4 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 5 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 6 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 7 | button | «Filtrar» | — | sí | 87 × 48 |
| 8 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí | 258 × 496 |
| 9 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |
| 10 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí | 258 × 496 |
| 11 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí | 258 × 496 |

### `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 48 |
| 2 | select | «Ciudad» | — | sí | 224 × 48 |
| 3 | input | «Fecha» | — | sí | 224 × 48 |
| 4 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 5 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 6 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 7 | button | «Filtrar» | — | sí | 87 × 48 |
| 8 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |

### `/?fecha=2026-11-23`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 48 |
| 2 | select | «Ciudad» | — | sí | 224 × 48 |
| 3 | input | «Fecha» | — | sí | 224 × 48 |
| 4 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 5 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 6 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 7 | button | «Filtrar» | — | sí | 87 × 48 |
| 8 | a | «Ver todos los eventos» | `/` | sí | 134 × 44 |

### `/?fecha=2026-02-30`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí | 224 × 48 |
| 2 | select | «Ciudad» | — | sí | 224 × 48 |
| 3 | input | «Fecha» | — | sí | 224 × 48 |
| 4 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 5 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 6 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 7 | button | «Filtrar» | — | sí | 87 × 48 |
| 8 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí | 258 × 496 |
| 9 | a | «Galaxia Perdida +7 Cine · Bogotá · 2 h 12 min» | `/eventos/2` | sí | 258 × 496 |
| 10 | a | «Risas en Familia TP Cine · Pitalito · 1 h 35 min» | `/eventos/3` | sí | 258 × 496 |
| 11 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |
| 12 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí | 258 × 496 |
| 13 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí | 258 × 496 |
| 14 | a | «Rock del Valle de Laboyos +16 Concierto · Pitalito · 2 h 30 min» | `/eventos/7` | sí | 258 × 496 |
| 15 | a | «Del Grano a la Taza TP Charla · Neiva · 1 h» | `/eventos/8` | sí | 258 × 496 |
| 16 | a | «Inteligencia Artificial sin Miedo TP Charla · Bogotá · 1 h 15 min» | `/eventos/9` | sí | 258 × 496 |
| 17 | a | «Historia del Huila en Cinco Objetos TP Charla · Íquira · 50 min» | `/eventos/10` | sí | 258 × 496 |

### `/eventos/4`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | a | «sábado, 21 de noviembre, 4:00 p. m., $ 25.000» | `/funciones/5` | sí | 190 × 50 |
| 3 | a | «sábado, 21 de noviembre, 11:30 p. m., $ 25.000» | `/funciones/4` | sí | 198 × 50 |
| 4 | a | «domingo, 22 de noviembre, 7:30 p. m., $ 25.000» | `/funciones/3` | sí | 190 × 50 |

### `/eventos/8`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | a | «domingo, 22 de noviembre, 10:30 a. m., $ 8.000» | `/funciones/10` | sí | 189 × 50 |

### `/eventos/10`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |

## Errores del servidor del frontend

Ninguno.

## Qué bloquea

Nada.

## Observaciones que no bloquean

Ninguna.

El detalle completo, con cada violación de axe y cada mensaje de consola, está en `informe.json`.
```
