---
name: matriz-criterios
description: Construye o verifica la matriz criterio de aceptación → prueba de una spec de Taquillera. Úsala al planear una spec, para decidir qué prueba defiende cada criterio, y al revisar, para comprobar que cada criterio tiene una prueba que falla si se borra el código.
metadata:
  author: Abilson Rivera Garcia y Bredman Estiven Velez Cortez
  version: "1.0.0"
---

# Matriz criterio → prueba

La matriz une cada criterio de aceptación de `spec.md` con la prueba que lo defiende. Sirve para que ningún criterio quede sin prueba y ninguna prueba exista solo para subir la cobertura.

## Formato

Va en la sección «Matriz» de `plan.md`:

| Criterio | Qué se comprueba | Tipo | Archivo de prueba | Nombre de la prueba |
|---|---|---|---|---|
| CA-1 | La tarjeta enlaza a `/eventos/{id}` | Componente | `frontend/src/components/EventoCard.test.tsx` | `enlaza al detalle del evento` |
| CA-4 | Un evento inexistente responde 404 | e2e | `backend/test/eventos.e2e-spec.ts` | `GET /eventos/9999 responde 404` |

Tipos válidos:

| Tipo | Dónde | Para qué |
|---|---|---|
| Unitaria | `backend/src/**/*.spec.ts`, `frontend/src/lib/*.test.ts` | Lógica de un servicio o de una función |
| e2e | `backend/test/*.e2e-spec.ts` | Un endpoint completo, con su código de estado |
| Componente | `frontend/src/components/*.test.tsx` | Lo que el usuario ve y puede pulsar |
| Navegador | `verificador-ui` | Lo que solo se ve al ejecutar: diseño, tema, accesibilidad |

## Al construirla (planificador)

1. Una fila por criterio. Un criterio que cruza backend y frontend lleva una fila por lado.
2. Elige el tipo más barato que de verdad lo comprueba: unitaria antes que e2e, e2e antes que navegador.
3. El nombre de la prueba describe el comportamiento, en español.
4. Si un criterio no se puede probar, no inventes la fila: devuélvelo como pregunta.

## Al verificarla (revisor)

Para cada fila:

1. La prueba existe, con ese nombre, en ese archivo.
2. **Prueba del borrado**: lee el código que cumple el criterio y pregúntate si la prueba fallaría al borrarlo o invertirlo. Si seguiría pasando, es un hallazgo alto.
3. No es una prueba débil:
   - No tiene aserciones, o solo `toBeDefined()` o `toBeTruthy()`.
   - Solo comprueba que se llamó al mock, sin mirar el resultado.
   - Compara un valor consigo mismo o con una copia calculada igual que el código.
   - Cubre solo el caso feliz de un criterio que habla de un error.
4. Ningún criterio de `spec.md` falta en la matriz.

Devuelve la matriz con una columna más, «¿Lo defiende?», con `sí`, `no` o `débil` y el motivo.
