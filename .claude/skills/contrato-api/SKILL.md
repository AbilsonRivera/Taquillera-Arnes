---
name: contrato-api
description: Define o compara el contrato JSON entre Taquillera-Backend y TaquilleraFrontend, campo por campo. Úsala al planear una spec que cruza los dos repositorios, para escribir el contrato, y después de implementarla, para comprobar que los tipos del frontend coinciden con lo que el backend responde.
metadata:
  author: Abilson Rivera Garcia y Bredman Estiven Velez Cortez
  version: "1.0.0"
---

# Contrato entre backend y frontend

Los dos repositorios declaran sus tipos por separado: no hay paquete compartido ni contrato generado. El tipo `Evento` está escrito dos veces. Un cambio de nombre en un lado no rompe ninguna prueba del otro.

## Dónde está cada lado

| Qué | Backend | Frontend |
|---|---|---|
| Forma de los datos | `backend/src/<modulo>/entities/*.entity.ts` y `dto/*.ts` | Tipos en `frontend/src/lib/*.ts` |
| Rutas y métodos | `@Controller`, `@Get`, `@Post` en `*.controller.ts` | La URL y el `method` de cada `fetch` en `frontend/src/lib/` |
| Códigos de estado y errores | Excepciones del servicio y pruebas de `backend/test/*.e2e-spec.ts` | Cómo trata `res.ok` y `res.status` cada función de `lib/` |

## Al definirlo (planificador)

Escribe en la sección «Contrato» de `plan.md`, por cada ruta:

```
GET /eventos/:id/funciones
200 → [{ "id": 1, "eventoId": 1, "inicio": "2026-11-21T19:30:00-05:00", "sala": "Sala 1", "precio": 15000 }]
404 → { "statusCode": 404, "message": "El evento 9 no existe", "error": "Not Found" }
```

- Nombres del dominio en español y en camelCase, como en `Evento`.
- Dinero como número entero en pesos; fechas como texto ISO 8601.
- Di cuáles campos son opcionales y qué valores admite cada enumeración.
- Incluye todos los errores que el frontend debe distinguir.

## Al compararlo (guardian-contrato)

Por cada ruta del plan, llena esta tabla campo por campo:

| Ruta | Campo | Backend | Frontend | Plan | ¿Coincide? |
|---|---|---|---|---|---|
| `GET /eventos/:id` | `duracionMinutos` | `number` (`evento.entity.ts:15`) | `number` (`eventos.ts:10`) | `number` | sí |

Comprueba en este orden:

1. **Ruta y método**: la URL que arma el frontend existe en un controlador, con el mismo método.
2. **Campos**: mismo nombre, tipo y opcionalidad. Un campo que el frontend lee y el backend no envía es una diferencia aunque compile.
3. **Enumeraciones**: los mismos valores en los dos lados.
4. **Errores**: cada código que el backend puede responder tiene un tratamiento en el frontend.
5. **Pruebas e2e**: comprueban la forma real de la respuesta, no solo el código de estado.

El resultado es `coincide` o la lista de filas con `no`, cada una con el lado que debe corregirse según el plan.
