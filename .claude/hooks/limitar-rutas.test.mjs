// Pruebas del hook limitar-rutas. Ejecutar con: npm run test:hooks
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { rutaPermitida } from './limitar-rutas.mjs';

const HOOK = fileURLToPath(new URL('./limitar-rutas.mjs', import.meta.url));
const RAIZ = path.resolve(path.dirname(HOOK), '..', '..');

const PROBADOR_BACK = ['backend/src/**/*.spec.ts', 'backend/test/**'];
const DESARROLLADOR_BACK = ['backend/src/**', '!backend/src/**/*.spec.ts'];
const PROBADOR_FRONT = ['frontend/src/**/*.test.ts', 'frontend/src/**/*.test.tsx'];
const ORQUESTADOR = ['specs/**'];

/** Ejecuta el hook como lo hace Claude Code: JSON por stdin y patrones como argumentos. */
function ejecutar(patrones, entrada) {
  const stdin = typeof entrada === 'string' ? entrada : JSON.stringify(entrada);
  return spawnSync(process.execPath, [HOOK, ...patrones], { input: stdin, encoding: 'utf8' });
}

const escribir = (file_path, cwd = RAIZ) => ({ tool_name: 'Write', tool_input: { file_path }, cwd });

test('el probador escribe pruebas y no código de producción', () => {
  assert.equal(rutaPermitida('backend/src/funciones/funciones.service.spec.ts', PROBADOR_BACK), true);
  assert.equal(rutaPermitida('backend/test/funciones.e2e-spec.ts', PROBADOR_BACK), true);
  assert.equal(rutaPermitida('backend/src/funciones/funciones.service.ts', PROBADOR_BACK), false);
  assert.equal(rutaPermitida('backend/package.json', PROBADOR_BACK), false);
});

test('el desarrollador escribe código y no puede tocar una prueba', () => {
  assert.equal(rutaPermitida('backend/src/funciones/funciones.service.ts', DESARROLLADOR_BACK), true);
  assert.equal(rutaPermitida('backend/src/app.module.ts', DESARROLLADOR_BACK), true);
  assert.equal(rutaPermitida('backend/src/funciones/funciones.service.spec.ts', DESARROLLADOR_BACK), false);
  assert.equal(rutaPermitida('backend/src/app.controller.spec.ts', DESARROLLADOR_BACK), false);
  assert.equal(rutaPermitida('backend/tsconfig.json', DESARROLLADOR_BACK), false);
  assert.equal(rutaPermitida('backend/.env', DESARROLLADOR_BACK), false);
});

test('las rutas de un repositorio no dan acceso al otro', () => {
  assert.equal(rutaPermitida('frontend/src/lib/peliculas.ts', DESARROLLADOR_BACK), false);
  assert.equal(rutaPermitida('backend/src/main.ts', PROBADOR_FRONT), false);
  assert.equal(rutaPermitida('frontend/src/lib/formato.test.ts', PROBADOR_FRONT), true);
  assert.equal(rutaPermitida('frontend/src/components/PeliculaCard.test.tsx', PROBADOR_FRONT), true);
  assert.equal(rutaPermitida('frontend/src/components/PeliculaCard.tsx', PROBADOR_FRONT), false);
});

test('el hook permite con código 0 y bloquea con código 2', () => {
  const permitido = ejecutar(ORQUESTADOR, escribir('specs/001-detalle-pelicula/plan.md'));
  assert.equal(permitido.status, 0);

  const bloqueado = ejecutar(ORQUESTADOR, escribir('backend/src/main.ts'));
  assert.equal(bloqueado.status, 2);
  assert.match(bloqueado.stderr, /no puedes escribir en "backend\/src\/main\.ts"/);
});

test('acepta rutas absolutas, con barra invertida y relativas al cwd de un repositorio', () => {
  const absoluta = path.join(RAIZ, 'backend', 'src', 'funciones', 'funciones.service.ts');
  assert.equal(ejecutar(DESARROLLADOR_BACK, escribir(absoluta)).status, 0);
  assert.equal(ejecutar(DESARROLLADOR_BACK, escribir('backend\\src\\main.ts')).status, 0);
  assert.equal(
    ejecutar(DESARROLLADOR_BACK, escribir('src/main.ts', path.join(RAIZ, 'backend'))).status,
    0,
  );
  assert.equal(
    ejecutar(DESARROLLADOR_BACK, escribir('src/main.spec.ts', path.join(RAIZ, 'backend'))).status,
    2,
  );
});

test('no se puede salir de las rutas con ".." ni escribir fuera del arnés', () => {
  assert.equal(ejecutar(DESARROLLADOR_BACK, escribir('backend/src/../package.json')).status, 2);
  assert.equal(ejecutar(DESARROLLADOR_BACK, escribir('backend/src/../../.claude/settings.json')).status, 2);
  assert.equal(ejecutar(ORQUESTADOR, escribir(path.join(RAIZ, '..', 'fuera.md'))).status, 2);
});

test('falla cerrado: entrada inválida, sin file_path o sin patrones', () => {
  assert.equal(ejecutar(ORQUESTADOR, 'esto no es JSON').status, 2);
  assert.equal(ejecutar(ORQUESTADOR, { tool_name: 'Write', tool_input: {} }).status, 2);
  assert.equal(ejecutar([], escribir('specs/001/plan.md')).status, 2);
});
