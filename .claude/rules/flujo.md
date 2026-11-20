# Flujo de trabajo

Estas normas aplican siempre, en cualquier archivo y para cualquier agente.

- No se escribe código sin una spec en `specs/NNN-nombre/spec.md` y un plan aprobado por el desarrollador humano.
- Una rama por spec en cada repositorio afectado, con el nombre de la carpeta: `feat/NNN-nombre`. Nunca se trabaja sobre `main`.
- Commits en español con Conventional Commits. En cada lado, el commit `test:` va antes de su `feat:`.
- El mensaje de un commit es solo el mensaje: sin líneas `Co-Authored-By` ni ninguna otra atribución a una herramienta. Los commits van a nombre de quien tiene configurado git.
- Ningún agente sube cambios ni fusiona: `git push` y `gh pr merge` los hace una persona.
- Los comandos de un repositorio se ejecutan como `cd backend && npm run ...` o `cd frontend && npm run ...`; los de git, como `git -C backend ...` o `git -C frontend ...`.
- Si el hook `limitar-rutas` o un permiso bloquea una acción, no se busca otro camino: se informa al orquestador. La única excepción es un comando del plan que fue negado por lo que llevaba pegado (un `echo`, una tubería): se puede repetir solo, sin añadidos, y se anota.
- Un control que falla dos veces seguidas, o que repite los mismos hallazgos, se detiene y se pregunta al desarrollador.
- Nadie lee ni escribe archivos `.env`.
