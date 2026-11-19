---
name: nueva-spec
description: Crea la carpeta de una spec de Taquillera (specs/NNN-nombre/spec.md) a partir de una historia o una idea, con criterios de aceptación verificables. Úsala cuando se pida una spec nueva, una historia de usuario o una funcionalidad nueva, antes de planear o programar.
metadata:
  author: Abilson Rivera Garcia y Bredman Estiven Velez Cortez
  version: "1.0.0"
---

# Nueva spec

Una spec dice **qué** se construye y **por qué**. El cómo va en `plan.md`, que escribe el planificador después.

## Pasos

1. Busca el número siguiente: mira las carpetas de `specs/` y suma uno al mayor (`001`, `002`...).
2. Nombra la carpeta `NNN-nombre-corto`, en minúsculas y con guiones. Ese mismo nombre lleva la rama: `feat/NNN-nombre-corto`.
3. Copia `specs/_plantilla/spec.md` a `specs/NNN-nombre-corto/spec.md` y complétala.
4. Agrega la fila de la spec a la tabla de `specs/README.md`.

`plan.md` y `tareas.md` no se crean aquí: los escribe el orquestador cuando el plan está aprobado.

## Cómo se escribe un criterio de aceptación

Cada criterio lleva un identificador (`CA-1`, `CA-2`...) y describe algo que se puede comprobar con una prueba o en la pantalla.

| En lugar de | Escribe |
|---|---|
| «La página debe verse bien» | «CA-3: en 390 px de ancho ningún texto se sale de la pantalla» |
| «Manejar errores» | «CA-5: si la película no existe, la página responde 404 y muestra "No encontramos esa película"» |
| «Validar los datos» | «CA-2: una compra sin correo responde 400 y no ocupa asientos» |

Antes de terminar, revisa cada criterio:

- Dice el resultado que ve el usuario o que recibe el cliente de la API, no la implementación.
- Tiene un solo comportamiento. Si lleva una «y» que une dos resultados, son dos criterios.
- Incluye los casos de error y de vacío que apliquen.
- Los textos visibles van textuales y entre comillas.

## Qué no va en la spec

- Nombres de archivos, clases o librerías: eso lo decide el plan.
- Funcionalidad «por si acaso». Lo que no se va a construir se anota en «Fuera de alcance».
