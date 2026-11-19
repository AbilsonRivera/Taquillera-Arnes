---
paths:
  - "backend/src/**/*.spec.ts"
  - "backend/test/**"
  - "frontend/src/**/*.test.ts"
  - "frontend/src/**/*.test.tsx"
---

# Pruebas

- Cada prueba defiende una fila de la matriz criterio → prueba del plan. Si no corresponde a ningún criterio, sobra o falta un criterio.
- El nombre dice el comportamiento esperado, en español: `responde 404 si la función no existe`.
- Una prueba debe fallar si se borra o se invierte el código que cumple su criterio. No valen las que solo comprueban `toBeDefined()`, que se llamó al mock o un valor contra sí mismo.
- Cada endpoint y cada función de `lib/` que puede fallar tiene al menos un caso de error.
- Backend: Vitest con `globals: true`, dobles con `vi.fn()`, imports relativos con `.js`; las e2e usan Supertest contra `AppModule`.
- Frontend: Vitest y Testing Library; se busca por rol o por texto visible, nunca por clases de Tailwind. `fetch` se simula; ninguna prueba llama al backend real.
- Las pruebas las escribe el probador y el código el desarrollador. Si una prueba está mal, la corrige el probador.
