// Pruebas del hook limitar-rutas. Ejecutar con: npm run test:hooks
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { rutaPermitida } from './limitar-rutas.mjs';

const HOOK = fileURLToPath(new URL('./limitar-rutas.mjs', import.meta.url));
const RAIZ = path.resolve(path.dirname(HOOK), '..', '..');
const RUTAS = JSON.parse(readFileSync(new URL('./rutas.json', import.meta.url), 'utf8'));

/** Ejecuta el hook como lo hace Claude Code: un JSON por stdin. */
function ejecutar(entrada) {
  const stdin = typeof entrada === 'string' ? entrada : JSON.stringify(entrada);
  return spawnSync(process.execPath, [HOOK], { input: stdin, encoding: 'utf8' });
}

/** Una escritura hecha por un agente. Con invocado=true, el agente es un subagente. */
function escribir(agente, file_path, { invocado = false, cwd = RAIZ } = {}) {
  return {
    hook_event_name: 'PreToolUse',
    tool_name: 'Write',
    tool_input: { file_path },
    cwd,
    agent_type: agente,
    ...(invocado ? { agent_id: 'a1b2c3' } : {}),
  };
}

test('el probador escribe pruebas y no código de producción', () => {
  const rutas = RUTAS['probador-back'];
  assert.equal(rutaPermitida('backend/src/funciones/funciones.service.spec.ts', rutas), true);
  assert.equal(rutaPermitida('backend/test/funciones.e2e-spec.ts', rutas), true);
  assert.equal(rutaPermitida('backend/src/funciones/funciones.service.ts', rutas), false);
  assert.equal(rutaPermitida('backend/package.json', rutas), false);
});

test('el desarrollador escribe código y no puede tocar una prueba', () => {
  const rutas = RUTAS['desarrollador-back'];
  assert.equal(rutaPermitida('backend/src/funciones/funciones.service.ts', rutas), true);
  assert.equal(rutaPermitida('backend/src/app.module.ts', rutas), true);
  assert.equal(rutaPermitida('backend/src/funciones/funciones.service.spec.ts', rutas), false);
  assert.equal(rutaPermitida('backend/tsconfig.json', rutas), false);
  assert.equal(rutaPermitida('backend/.env', rutas), false);
});

test('las rutas de un repositorio no dan acceso al otro', () => {
  assert.equal(rutaPermitida('frontend/src/lib/peliculas.ts', RUTAS['desarrollador-back']), false);
  assert.equal(rutaPermitida('backend/src/main.ts', RUTAS['probador-front']), false);
  assert.equal(rutaPermitida('frontend/src/lib/formato.test.ts', RUTAS['probador-front']), true);
  assert.equal(rutaPermitida('frontend/src/components/PeliculaCard.test.tsx', RUTAS['probador-front']), true);
  assert.equal(rutaPermitida('frontend/src/components/PeliculaCard.tsx', RUTAS['probador-front']), false);
  assert.equal(rutaPermitida('frontend/vitest.config.ts', RUTAS['desarrollador-front']), true);
  assert.equal(rutaPermitida('frontend/package.json', RUTAS['desarrollador-front']), false);
});

test('el hook permite con código 0 y bloquea con código 2', () => {
  const permitido = ejecutar(escribir('taquilla-orquestador', 'specs/001-detalle-pelicula/plan.md'));
  assert.equal(permitido.status, 0);

  const bloqueado = ejecutar(escribir('taquilla-orquestador', 'backend/src/main.ts'));
  assert.equal(bloqueado.status, 2);
  assert.match(bloqueado.stderr, /"taquilla-orquestador" no puede escribir en "backend\/src\/main\.ts"/);
});

test('un subagente invocado por el orquestador usa sus propias rutas, no las del orquestador', () => {
  // El caso que falló en la spec 001: el hook del orquestador bloqueaba al desarrollador.
  const delegada = { invocado: true };
  assert.equal(ejecutar(escribir('desarrollador-front', 'frontend/vitest.config.ts', delegada)).status, 0);
  assert.equal(ejecutar(escribir('desarrollador-back', 'backend/src/main.ts', delegada)).status, 0);
  assert.equal(ejecutar(escribir('desarrollador-back', 'specs/001-detalle-pelicula/plan.md', delegada)).status, 2);
  assert.equal(ejecutar(escribir('probador-front', 'frontend/src/lib/peliculas.ts', delegada)).status, 2);
});

test('los agentes de solo lectura no pueden escribir nada', () => {
  for (const agente of ['planificador', 'guardian-contrato', 'verificador-ui', 'revisor']) {
    const resultado = ejecutar(escribir(agente, 'specs/001-detalle-pelicula/plan.md', { invocado: true }));
    assert.equal(resultado.status, 2, agente);
    assert.match(resultado.stderr, /solo lectura/);
  }
});

test('un agente que no está en rutas.json queda bloqueado', () => {
  const resultado = ejecutar(escribir('general-purpose', 'specs/001-detalle-pelicula/plan.md', { invocado: true }));
  assert.equal(resultado.status, 2);
  assert.match(resultado.stderr, /no tiene rutas declaradas/);
});

test('la sesión normal del desarrollador, sin agente, no se limita', () => {
  const entrada = { tool_name: 'Write', tool_input: { file_path: 'README.md' }, cwd: RAIZ };
  assert.equal(ejecutar(entrada).status, 0);
  // Un subagente que llegue sin nombre no es la sesión del desarrollador: se bloquea.
  assert.equal(ejecutar({ ...entrada, agent_id: 'a1b2c3' }).status, 2);
});

test('acepta rutas absolutas, con barra invertida y relativas al cwd de un repositorio', () => {
  const agente = 'desarrollador-back';
  const absoluta = path.join(RAIZ, 'backend', 'src', 'funciones', 'funciones.service.ts');
  assert.equal(ejecutar(escribir(agente, absoluta)).status, 0);
  assert.equal(ejecutar(escribir(agente, 'backend\\src\\main.ts')).status, 0);
  const enBackend = { cwd: path.join(RAIZ, 'backend') };
  assert.equal(ejecutar(escribir(agente, 'src/main.ts', enBackend)).status, 0);
  assert.equal(ejecutar(escribir(agente, 'src/main.spec.ts', enBackend)).status, 2);
});

test('no se puede salir de las rutas con ".." ni escribir fuera del arnés', () => {
  assert.equal(ejecutar(escribir('desarrollador-back', 'backend/src/../package.json')).status, 2);
  assert.equal(ejecutar(escribir('desarrollador-back', 'backend/src/../../.claude/settings.json')).status, 2);
  assert.equal(ejecutar(escribir('taquilla-orquestador', path.join(RAIZ, '..', 'fuera.md'))).status, 2);
});

test('falla cerrado: entrada inválida o sin file_path', () => {
  assert.equal(ejecutar('esto no es JSON').status, 2);
  assert.equal(ejecutar({ tool_name: 'Write', tool_input: {}, agent_type: 'taquilla-orquestador' }).status, 2);
});

test('cada agente de .claude/agents tiene sus rutas declaradas', () => {
  const carpeta = path.join(RAIZ, '.claude', 'agents');
  const agentes = readdirSync(carpeta).map((archivo) => archivo.replace(/\.md$/, ''));
  assert.deepEqual(agentes.sort(), Object.keys(RUTAS).sort());
});
