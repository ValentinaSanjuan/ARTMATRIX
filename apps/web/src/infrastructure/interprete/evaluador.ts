// Intérprete propio v1.0 — ejecución limitada de Java dentro del navegador.
// Produce la secuencia de posiciones visitadas para dibujarla sobre la galería (RF-11).
import { ErrorJava } from './lexer';
import { analizar, type Expr, type Stmt } from './parser';

export interface Paso {
  fila: number;
  columna: number;
}

export interface EntornoGaleria {
  filas: number;
  columnas: number;
  /** Nombre de la obra en cada celda, o null si está vacía. */
  contenido?: (string | null)[][];
}

export interface ResultadoEjecucion {
  ok: boolean;
  pasos: Paso[];
  salida: string[];
  error?: { tipo: 'SINTAXIS' | 'EJECUCION'; mensaje: string; linea: number };
}

type Valor = number | boolean | string | null | Fila | Galeria | Funcion | Objeto;
interface Fila { tipo: 'fila'; i: number }
interface Galeria { tipo: 'galeria' }
interface Funcion { tipo: 'fn'; nombre: string }
interface Objeto { tipo: 'obj'; nombre: string }

const MAX_OPERACIONES = 200_000;
const MAX_PASOS = 500;
const MAX_LINEAS_SALIDA = 300;

class Romper { }
class Continuar { }
class Retornar { }

interface Variable { tipo: string; valor: Valor }

class Ambito {
  private vars = new Map<string, Variable>();
  constructor(readonly padre?: Ambito) {}
  buscar(nombre: string): Variable | undefined {
    return this.vars.get(nombre) ?? this.padre?.buscar(nombre);
  }
  declarar(nombre: string, v: Variable, linea: number) {
    if (this.buscarLocalYPadres(nombre)) {
      throw new ErrorJava('EJECUCION', `La variable "${nombre}" ya fue declarada.`, linea);
    }
    this.vars.set(nombre, v);
  }
  private buscarLocalYPadres(nombre: string): boolean {
    // Java no permite redeclarar una variable local que sigue en uso en un ámbito exterior del método.
    return this.vars.has(nombre) || (this.padre ? this.padre.esLocal(nombre) : false);
  }
  private esLocal(nombre: string): boolean {
    if (this.padre === undefined) return false; // el ámbito global (matriz, FILAS...) se puede ocultar
    return this.vars.has(nombre) || this.padre.esLocal(nombre);
  }
}

const esEntero = (t: string) => t === 'int' || t === 'long' || t === 'char';

export function ejecutarJava(codigo: string, galeria: EntornoGaleria): ResultadoEjecucion {
  const pasos: Paso[] = [];
  const salida: string[] = [];
  let operaciones = 0;

  const global = new Ambito();
  global.declarar('matriz', { tipo: 'galeria', valor: { tipo: 'galeria' } }, 0);
  global.declarar('FILAS', { tipo: 'int', valor: galeria.filas }, 0);
  global.declarar('COLUMNAS', { tipo: 'int', valor: galeria.columnas }, 0);
  for (const f of ['colocar', 'visitar']) global.declarar(f, { tipo: 'fn', valor: { tipo: 'fn', nombre: f } }, 0);
  global.declarar('System', { tipo: 'obj', valor: { tipo: 'obj', nombre: 'System' } }, 0);
  global.declarar('Math', { tipo: 'obj', valor: { tipo: 'obj', nombre: 'Math' } }, 0);

  const tick = (l: number) => {
    if (++operaciones > MAX_OPERACIONES) {
      throw new ErrorJava('EJECUCION', 'Tu programa tardó demasiado. ¿Hay un ciclo infinito? Revisa la condición y el incremento.', l);
    }
  };

  const texto = (v: Valor): string => {
    if (v === null) return 'null';
    if (typeof v === 'object') return v.tipo === 'galeria' ? 'matriz' : v.tipo === 'fila' ? `matriz[${v.i}]` : String(v);
    return String(v);
  };

  const numero = (v: Valor, l: number, que = 'La operación'): number => {
    if (typeof v !== 'number') throw new ErrorJava('EJECUCION', `${que} necesita un número y recibió ${texto(v)}.`, l);
    return v;
  };
  const logico = (v: Valor, l: number): boolean => {
    if (typeof v !== 'boolean') throw new ErrorJava('EJECUCION', `Se esperaba una condición verdadera/falsa (boolean) y se recibió ${texto(v)}.`, l);
    return v;
  };
  const indice = (v: Valor, largo: number, l: number): number => {
    const i = numero(v, l, 'El índice');
    if (!Number.isInteger(i) || i < 0 || i >= largo) {
      throw new ErrorJava('EJECUCION', `ArrayIndexOutOfBoundsException: el índice ${i} está fuera de la matriz (longitud ${largo}).`, l);
    }
    return i;
  };

  const colocar = (args: Valor[], l: number) => {
    if (args.length !== 2) throw new ErrorJava('EJECUCION', 'colocar necesita dos números: colocar(fila, columna).', l);
    const f = numero(args[0], l, 'colocar');
    const c = numero(args[1], l, 'colocar');
    if (f < 0 || f >= galeria.filas) {
      throw new ErrorJava('EJECUCION', `ArrayIndexOutOfBoundsException: la fila ${f} no existe (filas de 0 a ${galeria.filas - 1}).`, l);
    }
    if (c < 0 || c >= galeria.columnas) {
      throw new ErrorJava('EJECUCION', `ArrayIndexOutOfBoundsException: la columna ${c} no existe (columnas de 0 a ${galeria.columnas - 1}).`, l);
    }
    if (pasos.length >= MAX_PASOS) throw new ErrorJava('EJECUCION', 'Se colocaron demasiadas obras.', l);
    pasos.push({ fila: f, columna: c });
  };

  // ---------- Expresiones ----------

  const leer = (e: Expr, amb: Ambito): Valor => {
    tick(e.l);
    switch (e.k) {
      case 'num': return e.v;
      case 'str': return e.v;
      case 'bool': return e.v;
      case 'null': return null;
      case 'var': {
        const v = amb.buscar(e.nombre);
        if (!v) throw new ErrorJava('EJECUCION', `No se encontró la variable "${e.nombre}". ¿La declaraste antes de usarla?`, e.l);
        if (v.valor === undefined) throw new ErrorJava('EJECUCION', `La variable "${e.nombre}" no tiene valor todavía.`, e.l);
        return v.valor;
      }
      case 'tern': return logico(leer(e.c, amb), e.l) ? leer(e.a, amb) : leer(e.b, amb);
      case 'un': {
        const a = leer(e.a, amb);
        if (e.op === '!') return !logico(a, e.l);
        if (e.op === '-') return -numero(a, e.l);
        return numero(a, e.l);
      }
      case 'bin': return binaria(e, amb);
      case 'asig': return asignar(e, amb);
      case 'incr': {
        const antes = numero(leer(e.destino, amb), e.l, e.op);
        const despues = e.op === '++' ? antes + 1 : antes - 1;
        escribir(e.destino, despues, amb, e.l);
        return e.prefijo ? despues : antes;
      }
      case 'idx': {
        const obj = leer(e.obj, amb);
        if (obj && typeof obj === 'object' && obj.tipo === 'galeria') {
          return { tipo: 'fila', i: indice(leer(e.indice, amb), galeria.filas, e.l) };
        }
        if (obj && typeof obj === 'object' && obj.tipo === 'fila') {
          const j = indice(leer(e.indice, amb), galeria.columnas, e.l);
          return galeria.contenido?.[obj.i]?.[j] ?? 'V';
        }
        throw new ErrorJava('EJECUCION', 'Solo se pueden usar corchetes con la matriz: matriz[fila][columna].', e.l);
      }
      case 'miembro': {
        const obj = leer(e.obj, amb);
        if (e.nombre === 'length' && obj && typeof obj === 'object') {
          if (obj.tipo === 'galeria') return galeria.filas;
          if (obj.tipo === 'fila') return galeria.columnas;
        }
        if (typeof obj === 'string' && e.nombre === 'length') {
          throw new ErrorJava('EJECUCION', 'Para la longitud de un texto usa length() con paréntesis.', e.l);
        }
        if (obj && typeof obj === 'object' && obj.tipo === 'obj') {
          return { tipo: 'obj', nombre: `${obj.nombre}.${e.nombre}` };
        }
        if (typeof obj === 'string') return { tipo: 'obj', nombre: `__str.${e.nombre}` };
        throw new ErrorJava('EJECUCION', `No se reconoce ".${e.nombre}".`, e.l);
      }
      case 'llamada': return llamar(e, amb);
    }
  };

  const llamar = (e: Extract<Expr, { k: 'llamada' }>, amb: Ambito): Valor => {
    // Métodos de String: texto.equals(x), texto.length()
    if (e.fn.k === 'miembro') {
      const base = e.fn.obj;
      const nombre = e.fn.nombre;
      const objetivo = leer(base, amb);
      if (typeof objetivo === 'string') {
        if (nombre === 'equals') return objetivo === texto(leer(e.args[0], amb));
        if (nombre === 'length') return objetivo.length;
        throw new ErrorJava('EJECUCION', `El método ${nombre}() de String no está disponible.`, e.l);
      }
      if (objetivo && typeof objetivo === 'object' && objetivo.tipo === 'obj') {
        const ruta = `${objetivo.nombre}.${nombre}`;
        const args = e.args.map((a) => leer(a, amb));
        switch (ruta) {
          case 'System.out.println':
          case 'System.out.print': {
            if (salida.length >= MAX_LINEAS_SALIDA) throw new ErrorJava('EJECUCION', 'Se imprimieron demasiadas líneas.', e.l);
            salida.push(args.length ? texto(args[0]) : '');
            return null;
          }
          case 'Math.abs': return Math.abs(numero(args[0], e.l));
          case 'Math.max': return Math.max(numero(args[0], e.l), numero(args[1], e.l));
          case 'Math.min': return Math.min(numero(args[0], e.l), numero(args[1], e.l));
        }
        throw new ErrorJava('EJECUCION', `El método ${ruta}() no está disponible en ArtMatrix.`, e.l);
      }
    }
    const fn = leer(e.fn, amb);
    if (fn && typeof fn === 'object' && fn.tipo === 'fn') {
      colocar(e.args.map((a) => leer(a, amb)), e.l);
      return null;
    }
    const nombre = e.fn.k === 'var' ? e.fn.nombre : 'eso';
    throw new ErrorJava('EJECUCION', `"${nombre}" no es un método disponible. Usa colocar(fila, columna).`, e.l);
  };

  const binaria = (e: Extract<Expr, { k: 'bin' }>, amb: Ambito): Valor => {
    if (e.op === '&&') return logico(leer(e.a, amb), e.l) && logico(leer(e.b, amb), e.l);
    if (e.op === '||') return logico(leer(e.a, amb), e.l) || logico(leer(e.b, amb), e.l);
    const a = leer(e.a, amb);
    const b = leer(e.b, amb);
    if (e.op === '+' && (typeof a === 'string' || typeof b === 'string')) return texto(a) + texto(b);
    if (e.op === '==') return a === b;
    if (e.op === '!=') return a !== b;
    const x = numero(a, e.l, `El operador ${e.op}`);
    const y = numero(b, e.l, `El operador ${e.op}`);
    const enteros = Number.isInteger(x) && Number.isInteger(y);
    switch (e.op) {
      case '+': return x + y;
      case '-': return x - y;
      case '*': return x * y;
      case '/':
        if (y === 0 && enteros) throw new ErrorJava('EJECUCION', 'ArithmeticException: división entre cero.', e.l);
        return enteros ? Math.trunc(x / y) : x / y;
      case '%':
        if (y === 0 && enteros) throw new ErrorJava('EJECUCION', 'ArithmeticException: módulo entre cero.', e.l);
        return x % y;
      case '<': return x < y;
      case '<=': return x <= y;
      case '>': return x > y;
      case '>=': return x >= y;
    }
    throw new ErrorJava('EJECUCION', `Operador ${e.op} no soportado.`, e.l);
  };

  const escribir = (destino: Expr, valor: Valor, amb: Ambito, l: number) => {
    if (destino.k !== 'var') {
      throw new ErrorJava('EJECUCION', 'La matriz de la galería es de solo lectura: usa colocar(fila, columna).', l);
    }
    const v = amb.buscar(destino.nombre);
    if (!v) throw new ErrorJava('EJECUCION', `No se encontró la variable "${destino.nombre}". ¿La declaraste?`, l);
    if (['galeria', 'fn', 'obj'].includes(v.tipo) || destino.nombre === 'FILAS' || destino.nombre === 'COLUMNAS') {
      throw new ErrorJava('EJECUCION', `"${destino.nombre}" no se puede modificar.`, l);
    }
    v.valor = convertir(v.tipo, valor, destino.nombre, l);
  };

  const asignar = (e: Extract<Expr, { k: 'asig' }>, amb: Ambito): Valor => {
    const actual = e.op !== '=' ? leer(e.destino, amb) : null;
    let valor = leer(e.valor, amb);
    if (e.op !== '=') valor = operarCompuesto(e.op[0], actual, valor, e.l);
    escribir(e.destino, valor, amb, e.l);
    return valor;
  };

  const operarCompuesto = (op: string, a: Valor, b: Valor, l: number): Valor => {
    if (op === '+' && (typeof a === 'string' || typeof b === 'string')) return texto(a) + texto(b);
    const x = numero(a, l);
    const y = numero(b, l);
    switch (op) {
      case '+': return x + y;
      case '-': return x - y;
      case '*': return x * y;
      case '/':
        if (y === 0) throw new ErrorJava('EJECUCION', 'ArithmeticException: división entre cero.', l);
        return Math.trunc(x / y);
      default:
        if (y === 0) throw new ErrorJava('EJECUCION', 'ArithmeticException: módulo entre cero.', l);
        return x % y;
    }
  };

  const convertir = (tipo: string, valor: Valor, nombre: string, l: number): Valor => {
    if (tipo === 'var') return valor;
    if (esEntero(tipo)) {
      if (typeof valor !== 'number') throw new ErrorJava('EJECUCION', `Tipos incompatibles: "${nombre}" es ${tipo} y recibió ${texto(valor)}.`, l);
      if (!Number.isInteger(valor)) throw new ErrorJava('EJECUCION', `Tipos incompatibles: "${nombre}" es ${tipo} y no puede guardar decimales.`, l);
      return valor;
    }
    if (tipo === 'double') {
      if (typeof valor !== 'number') throw new ErrorJava('EJECUCION', `Tipos incompatibles: "${nombre}" es double y recibió ${texto(valor)}.`, l);
      return valor;
    }
    if (tipo === 'boolean' && typeof valor !== 'boolean') {
      throw new ErrorJava('EJECUCION', `Tipos incompatibles: "${nombre}" es boolean y recibió ${texto(valor)}.`, l);
    }
    if (tipo === 'String' && valor !== null && typeof valor !== 'string') {
      throw new ErrorJava('EJECUCION', `Tipos incompatibles: "${nombre}" es String y recibió ${texto(valor)}.`, l);
    }
    return valor;
  };

  // ---------- Sentencias ----------

  const ejecutar = (s: Stmt, amb: Ambito): void => {
    tick(s.l);
    switch (s.k) {
      case 'vacio': return;
      case 'bloque': {
        const interno = new Ambito(amb);
        for (const x of s.cuerpo) ejecutar(x, interno);
        return;
      }
      case 'decl':
        for (const v of s.vars) {
          const valor = v.init ? convertir(s.tipo, leer(v.init, amb), v.nombre, s.l) : (undefined as unknown as Valor);
          amb.declarar(v.nombre, { tipo: s.tipo, valor }, s.l);
        }
        return;
      case 'expr':
        leer(s.e, amb);
        return;
      case 'if':
        if (logico(leer(s.c, amb), s.l)) ejecutar(s.si, new Ambito(amb));
        else if (s.sino) ejecutar(s.sino, new Ambito(amb));
        return;
      case 'while':
        while (logico(leer(s.c, amb), s.l)) {
          try { ejecutar(s.cuerpo, new Ambito(amb)); } catch (x) {
            if (x instanceof Romper) break;
            if (x instanceof Continuar) continue;
            throw x;
          }
        }
        return;
      case 'dowhile':
        do {
          try { ejecutar(s.cuerpo, new Ambito(amb)); } catch (x) {
            if (x instanceof Romper) break;
            if (x instanceof Continuar) continue;
            throw x;
          }
        } while (logico(leer(s.c, amb), s.l));
        return;
      case 'for': {
        const ambFor = new Ambito(amb);
        if (s.init) ejecutar(s.init, ambFor);
        while (s.c ? logico(leer(s.c, ambFor), s.l) : true) {
          try { ejecutar(s.cuerpo, new Ambito(ambFor)); } catch (x) {
            if (x instanceof Romper) break;
            if (!(x instanceof Continuar)) throw x;
          }
          for (const u of s.update) leer(u, ambFor);
        }
        return;
      }
      case 'break': throw new Romper();
      case 'continue': throw new Continuar();
      case 'return': throw new Retornar();
    }
  };

  try {
    const programa = analizar(codigo);
    try {
      ejecutar(programa, new Ambito(global));
    } catch (x) {
      if (x instanceof Retornar) { /* fin de main */ }
      else if (x instanceof Romper || x instanceof Continuar) {
        throw new ErrorJava('SINTAXIS', 'break/continue solo se pueden usar dentro de un ciclo.', 0);
      } else throw x;
    }
    return { ok: true, pasos, salida };
  } catch (x) {
    if (x instanceof ErrorJava) {
      return { ok: false, pasos, salida, error: { tipo: x.tipo, mensaje: x.message, linea: x.linea } };
    }
    if (x instanceof RangeError) {
      return { ok: false, pasos, salida, error: { tipo: 'EJECUCION', mensaje: 'El programa es demasiado complejo para ejecutarse.', linea: 0 } };
    }
    throw x;
  }
}
