---
paths:
  - "backend/src/**/entities/**"
  - "backend/src/**/dto/**"
  - "backend/src/**/*.controller.ts"
  - "frontend/src/lib/**"
---

# Contrato de la API

- Estos archivos definen el contrato entre los dos repositorios. Cambiar un nombre, un tipo o un código de estado en un lado exige el mismo cambio en el otro, dentro de la misma spec.
- La fuente de verdad es la sección «Contrato» de `plan.md`. Si hace falta cambiarla, primero se corrige el plan.
- Los tipos de la API se declaran una sola vez en `frontend/src/lib/`. Ningún componente declara su propia copia.
- Nombres del dominio en español y camelCase; dinero en pesos como número entero; fechas en ISO 8601.
- Después de tocar cualquiera de estos archivos, el orquestador invoca al `guardian-contrato` antes del revisor.
