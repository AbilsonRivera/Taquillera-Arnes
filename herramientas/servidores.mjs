#!/usr/bin/env node
// Compila, levanta y detiene el backend y el frontend de Taquillera sin dejar procesos huérfanos.
//
//   npm run servidores -- iniciar back|front|ambos
//   npm run servidores -- detener [back|front|ambos]
//   npm run servidores -- estado
//
// Levanta las compilaciones de producción (node dist/main.js y next start), que es lo
// mismo que valida el CI. Los registros quedan en .arnes/back.log y .arnes/front.log.

import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ESTADO = path.join(RAIZ, '.arnes');
const ES_WINDOWS = process.platform === 'win32';

export const LADOS = {
  back: {
    nombre: 'backend',
    carpeta: path.join(RAIZ, 'backend'),
    puerto: 3001,
    listo: 'http://localhost:3001/peliculas',
    // node dist/main.js, igual que el script start:prod del backend.
    arranque: () => [process.execPath, ['dist/main.js']],
    entorno: { PORT: '3001' },
  },
  front: {
    nombre: 'frontend',
    carpeta: path.join(RAIZ, 'frontend'),
    puerto: 3000,
    listo: 'http://localhost:3000/',
    arranque: () => [process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3000']],
    entorno: { NEXT_PUBLIC_API_URL: 'http://localhost:3001' },
  },
};

const ladosDe = (cual) => (cual === 'ambos' || cual === undefined ? ['back', 'front'] : [cual]);
const archivoPid = (lado) => path.join(ESTADO, `${lado}.pid`);
export const archivoLog = (lado) => path.join(ESTADO, `${lado}.log`);
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

/** PID de los procesos que escuchan en un puerto. */
function pidsEnPuerto(puerto) {
  try {
    if (ES_WINDOWS) {
      const salida = execFileSync('netstat', ['-ano'], { encoding: 'utf8' });
      const pids = salida
        .split(/\r?\n/)
        .map((linea) => linea.trim().split(/\s+/))
        .filter((c) => c[0] === 'TCP' && c[3] === 'LISTENING' && c[1].endsWith(`:${puerto}`))
        .map((c) => Number(c[4]));
      return [...new Set(pids)].filter((pid) => pid > 0);
    }
    const salida = execFileSync('lsof', ['-ti', `tcp:${puerto}`, '-sTCP:LISTEN'], { encoding: 'utf8' });
    return salida.split('\n').filter(Boolean).map(Number);
  } catch {
    return [];
  }
}

function matar(pid) {
  if (ES_WINDOWS) {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
    return;
  }
  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // El proceso ya no existe.
    }
  }
}

const compilarLado = (carpeta) =>
  spawnSync('npm', ['run', 'build'], { cwd: carpeta, encoding: 'utf8', shell: true });

async function responde(url) {
  try {
    const respuesta = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return respuesta.status < 500;
  } catch {
    return false;
  }
}

export async function detener(cual = 'ambos') {
  for (const lado of ladosDe(cual)) {
    const { puerto, nombre } = LADOS[lado];
    const pids = new Set(pidsEnPuerto(puerto));
    if (existsSync(archivoPid(lado))) {
      pids.add(Number(readFileSync(archivoPid(lado), 'utf8')));
      rmSync(archivoPid(lado), { force: true });
    }
    for (const pid of pids) if (pid > 0) matar(pid);
    for (let i = 0; i < 25 && pidsEnPuerto(puerto).length > 0; i++) await esperar(200);
    if (pidsEnPuerto(puerto).length > 0) {
      throw new Error(`No se pudo liberar el puerto ${puerto} del ${nombre}.`);
    }
    console.log(`${nombre}: detenido (puerto ${puerto} libre).`);
  }
}

export async function iniciar(cual = 'ambos', { compilar = true } = {}) {
  mkdirSync(ESTADO, { recursive: true });
  for (const lado of ladosDe(cual)) {
    const { nombre, carpeta, puerto, listo, arranque, entorno } = LADOS[lado];
    if (!existsSync(path.join(carpeta, 'node_modules'))) {
      throw new Error(`Falta ${nombre}/node_modules. Ejecuta scripts/preparar.ps1 primero.`);
    }
    await detener(lado);

    if (compilar) {
      console.log(`${nombre}: compilando (npm run build)...`);
      let build = compilarLado(carpeta);
      // Cuando la versión instalada de Next tiene una vulnerabilidad conocida y detecta
      // que lo ejecuta un agente, detiene la primera compilación para pedir que se
      // actualice. No es un fallo del código: se avisa y se repite una sola vez.
      if (build.status !== 0 && /SecurityFatalError/.test(build.stdout + build.stderr)) {
        console.warn(`${nombre}: Next detuvo la compilación por un aviso de seguridad de su versión.`);
        console.warn('Se repite una vez. Actualizar next es decisión del desarrollador, no de un agente.');
        build = compilarLado(carpeta);
      }
      if (build.status !== 0) {
        console.error(build.stdout);
        console.error(build.stderr);
        throw new Error(`${nombre}: npm run build falló con código ${build.status}.`);
      }
    }

    const log = openSync(archivoLog(lado), 'w');
    const [comando, argumentos] = arranque();
    const proceso = spawn(comando, argumentos, {
      cwd: carpeta,
      env: { ...process.env, ...entorno },
      detached: true,
      windowsHide: true,
      stdio: ['ignore', log, log],
    });
    proceso.unref();
    closeSync(log);
    writeFileSync(archivoPid(lado), String(proceso.pid));

    let arriba = false;
    for (let i = 0; i < 120 && !arriba; i++) {
      await esperar(500);
      arriba = await responde(listo);
    }
    if (!arriba) {
      const registro = readFileSync(archivoLog(lado), 'utf8');
      await detener(lado);
      throw new Error(`${nombre}: no respondió en ${listo} después de 60 s.\n${registro}`);
    }
    console.log(`${nombre}: listo en http://localhost:${puerto} (pid ${proceso.pid}).`);
  }
}

export async function estado() {
  for (const lado of ['back', 'front']) {
    const { nombre, puerto, listo } = LADOS[lado];
    const arriba = await responde(listo);
    console.log(`${nombre}: ${arriba ? `responde en el puerto ${puerto}` : 'detenido'}`);
  }
}

const ejecutadoDirectamente =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (ejecutadoDirectamente) {
  const [accion, cual] = process.argv.slice(2);
  const acciones = { iniciar, detener, estado };
  const ladoValido = cual === undefined || cual === 'ambos' || cual in LADOS;
  if (!(accion in acciones) || !ladoValido) {
    console.error('Uso: npm run servidores -- iniciar|detener|estado [back|front|ambos]');
    process.exit(1);
  }
  try {
    await acciones[accion](cual);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
