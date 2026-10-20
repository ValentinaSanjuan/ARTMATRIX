// Intérprete propio v1.0 — analizador sintáctico (subconjunto de Java).
import { ErrorJava, tokenizar, type Token } from './lexer';

export type Expr =
  | { k: 'num'; v: number; l: number }
  | { k: 'str'; v: string; l: number }
  | { k: 'bool'; v: boolean; l: number }
  | { k: 'null'; l: number }
  | { k: 'var'; nombre: string; l: number }
  | { k: 'bin'; op: string; a: Expr; b: Expr; l: number }
  | { k: 'un'; op: string; a: Expr; l: number }
  | { k: 'tern'; c: Expr; a: Expr; b: Expr; l: number }
  | { k: 'asig'; op: string; destino: Expr; valor: Expr; l: number }
  | { k: 'incr'; op: '++' | '--'; prefijo: boolean; destino: Expr; l: number }
  | { k: 'idx'; obj: Expr; indice: Expr; l: number }
  | { k: 'miembro'; obj: Expr; nombre: string; l: number }
  | { k: 'llamada'; fn: Expr; args: Expr[]; l: number };

export type Stmt =
  | { k: 'bloque'; cuerpo: Stmt[]; l: number }
  | { k: 'decl'; tipo: string; vars: { nombre: string; init?: Expr }[]; l: number }
  | { k: 'expr'; e: Expr; l: number }
  | { k: 'if'; c: Expr; si: Stmt; sino?: Stmt; l: number }
  | { k: 'while'; c: Expr; cuerpo: Stmt; l: number }
  | { k: 'dowhile'; c: Expr; cuerpo: Stmt; l: number }
  | { k: 'for'; init?: Stmt; c?: Expr; update: Expr[]; cuerpo: Stmt; l: number }
  | { k: 'break'; l: number }
  | { k: 'continue'; l: number }
  | { k: 'return'; e?: Expr; l: number }
  | { k: 'vacio'; l: number };

const TIPOS = new Set(['int', 'boolean', 'String', 'var', 'double', 'char', 'long']);
const MODIFICADORES = new Set(['public', 'private', 'protected', 'static', 'final']);

class Parser {
  private p = 0;
  constructor(private readonly t: Token[]) {}

  private get actual(): Token {
    return this.t[this.p];
  }
  private ver(n = 0): Token {
    return this.t[Math.min(this.p + n, this.t.length - 1)];
  }
  private es(valor: string, n = 0): boolean {
    const tk = this.ver(n);
    return (tk.tipo === 'op' || tk.tipo === 'kw') && tk.valor === valor;
  }
  private avanzar(): Token {
    return this.t[this.p++];
  }
  private aceptar(valor: string): boolean {
    if (this.es(valor)) {
      this.p++;
      return true;
    }
    return false;
  }
  private esperar(valor: string, contexto?: string): Token {
    if (this.es(valor)) return this.avanzar();
    const tk = this.actual;
    const encontrado = tk.tipo === 'eof' ? 'el final del código' : `"${tk.valor}"`;
    const linea = valor === ';' && this.p > 0 ? this.t[this.p - 1].linea : tk.linea;
    throw new ErrorJava('SINTAXIS', `Se esperaba "${valor}"${contexto ? ' ' + contexto : ''} pero se encontró ${encontrado}.`, linea);
  }
  private identificador(): string {
    const tk = this.actual;
    if (tk.tipo !== 'id') throw new ErrorJava('SINTAXIS', `Se esperaba un nombre pero se encontró "${tk.valor || 'fin'}".`, tk.linea);
    this.p++;
    return tk.valor;
  }

  // ---------- Programa ----------

  programa(): Stmt {
    // Si hay "class", buscamos el método main; si no, el código son instrucciones sueltas.
    let i = this.p;
    while (this.t[i] && this.t[i].tipo === 'kw' && MODIFICADORES.has(this.t[i].valor)) i++;
    if (this.t[i]?.valor === 'class') {
      this.p = i + 1;
      this.identificador();
      this.esperar('{', 'para abrir la clase');
      let main: Stmt | null = null;
      while (!this.es('}') && this.actual.tipo !== 'eof') {
        const cuerpo = this.metodo();
        if (cuerpo.nombre === 'main') main = cuerpo.cuerpo;
      }
      this.esperar('}', 'para cerrar la clase');
      if (!main) throw new ErrorJava('SINTAXIS', 'No se encontró el método main.', this.actual.linea);
      return main;
    }
    const cuerpo: Stmt[] = [];
    while (this.actual.tipo !== 'eof') cuerpo.push(this.sentencia());
    return { k: 'bloque', cuerpo, l: 1 };
  }

  private metodo(): { nombre: string; cuerpo: Stmt } {
    while (this.actual.tipo === 'kw' && MODIFICADORES.has(this.actual.valor)) this.p++;
    const tipo = this.avanzar();
    if (!(tipo.tipo === 'kw' || tipo.tipo === 'id')) {
      throw new ErrorJava('SINTAXIS', 'Solo se admiten métodos dentro de la clase.', tipo.linea);
    }
    while (this.aceptar('[')) this.esperar(']');
    const nombre = this.identificador();
    this.esperar('(', 'después del nombre del método');
    while (!this.es(')') && this.actual.tipo !== 'eof') this.avanzar();
    this.esperar(')');
    return { nombre, cuerpo: this.bloque() };
  }

  // ---------- Sentencias ----------

  private bloque(): Stmt {
    const l = this.esperar('{').linea;
    const cuerpo: Stmt[] = [];
    while (!this.es('}')) {
      if (this.actual.tipo === 'eof') throw new ErrorJava('SINTAXIS', 'Falta cerrar una llave "}".', l);
      cuerpo.push(this.sentencia());
    }
    this.esperar('}');
    return { k: 'bloque', cuerpo, l };
  }

  private esDeclaracion(): boolean {
    const tk = this.actual;
    if (tk.tipo === 'kw' && TIPOS.has(tk.valor)) return true;
    if (tk.tipo === 'kw' && tk.valor === 'final') return true;
    return false;
  }

  private declaracion(conPuntoYComa: boolean): Stmt {
    const l = this.actual.linea;
    this.aceptar('final');
    const tipo = this.avanzar().valor;
    while (this.aceptar('[')) this.esperar(']');
    const vars: { nombre: string; init?: Expr }[] = [];
    do {
      const nombre = this.identificador();
      const init = this.aceptar('=') ? this.expresion() : undefined;
      vars.push({ nombre, init });
    } while (this.aceptar(','));
    if (conPuntoYComa) this.esperar(';', 'al final de la declaración');
    return { k: 'decl', tipo, vars, l };
  }

  private sentencia(): Stmt {
    const tk = this.actual;
    const l = tk.linea;
    if (this.es('{')) return this.bloque();
    if (this.aceptar(';')) return { k: 'vacio', l };
    if (this.esDeclaracion()) return this.declaracion(true);

    if (this.aceptar('if')) {
      this.esperar('(', 'después de if');
      const c = this.expresion();
      this.esperar(')', 'para cerrar la condición del if');
      const si = this.sentencia();
      const sino = this.aceptar('else') ? this.sentencia() : undefined;
      return { k: 'if', c, si, sino, l };
    }
    if (this.aceptar('while')) {
      this.esperar('(', 'después de while');
      const c = this.expresion();
      this.esperar(')', 'para cerrar la condición del while');
      return { k: 'while', c, cuerpo: this.sentencia(), l };
    }
    if (this.aceptar('do')) {
      const cuerpo = this.sentencia();
      this.esperar('while');
      this.esperar('(');
      const c = this.expresion();
      this.esperar(')');
      this.esperar(';');
      return { k: 'dowhile', c, cuerpo, l };
    }
    if (this.aceptar('for')) {
      this.esperar('(', 'después de for');
      let init: Stmt | undefined;
      if (!this.es(';')) {
        init = this.esDeclaracion() ? this.declaracion(false) : { k: 'expr', e: this.expresion(), l };
      }
      this.esperar(';', 'después de la inicialización del for');
      const c = this.es(';') ? undefined : this.expresion();
      this.esperar(';', 'después de la condición del for');
      const update: Expr[] = [];
      if (!this.es(')')) {
        do update.push(this.expresion());
        while (this.aceptar(','));
      }
      this.esperar(')', 'para cerrar el for');
      return { k: 'for', init, c, update, cuerpo: this.sentencia(), l };
    }
    if (this.aceptar('break')) {
      this.esperar(';');
      return { k: 'break', l };
    }
    if (this.aceptar('continue')) {
      this.esperar(';');
      return { k: 'continue', l };
    }
    if (this.aceptar('return')) {
      const e = this.es(';') ? undefined : this.expresion();
      this.esperar(';');
      return { k: 'return', e, l };
    }
    if (this.es('else')) throw new ErrorJava('SINTAXIS', '"else" sin un "if" antes.', l);

    const e = this.expresion();
    this.esperar(';', 'al final de la instrucción');
    return { k: 'expr', e, l };
  }

  // ---------- Expresiones ----------

  expresion(): Expr {
    return this.asignacion();
  }

  private asignacion(): Expr {
    const izq = this.ternario();
    const tk = this.actual;
    if (tk.tipo === 'op' && ['=', '+=', '-=', '*=', '/=', '%='].includes(tk.valor)) {
      this.p++;
      if (izq.k !== 'var' && izq.k !== 'idx') {
        throw new ErrorJava('SINTAXIS', 'Solo se puede asignar a una variable.', tk.linea);
      }
      return { k: 'asig', op: tk.valor, destino: izq, valor: this.asignacion(), l: tk.linea };
    }
    return izq;
  }

  private ternario(): Expr {
    const c = this.binario(0);
    if (this.es('?')) {
      const l = this.avanzar().linea;
      const a = this.expresion();
      this.esperar(':');
      const b = this.ternario();
      return { k: 'tern', c, a, b, l };
    }
    return c;
  }

  private static NIVELES = [['||'], ['&&'], ['==', '!='], ['<', '<=', '>', '>='], ['+', '-'], ['*', '/', '%']];

  private binario(nivel: number): Expr {
    if (nivel >= Parser.NIVELES.length) return this.unario();
    let a = this.binario(nivel + 1);
    while (this.actual.tipo === 'op' && Parser.NIVELES[nivel].includes(this.actual.valor)) {
      const tk = this.avanzar();
      const b = this.binario(nivel + 1);
      a = { k: 'bin', op: tk.valor, a, b, l: tk.linea };
    }
    return a;
  }

  private unario(): Expr {
    const tk = this.actual;
    if (tk.tipo === 'op' && (tk.valor === '!' || tk.valor === '-' || tk.valor === '+')) {
      this.p++;
      return { k: 'un', op: tk.valor, a: this.unario(), l: tk.linea };
    }
    if (tk.tipo === 'op' && (tk.valor === '++' || tk.valor === '--')) {
      this.p++;
      return { k: 'incr', op: tk.valor, prefijo: true, destino: this.unario(), l: tk.linea };
    }
    // Conversión (int) x
    if (this.es('(') && this.ver(1).tipo === 'kw' && TIPOS.has(this.ver(1).valor) && this.es(')', 2)) {
      this.p += 3;
      return this.unario();
    }
    return this.postfijo();
  }

  private postfijo(): Expr {
    let e = this.primario();
    for (;;) {
      const tk = this.actual;
      if (this.aceptar('.')) {
        e = { k: 'miembro', obj: e, nombre: this.identificador(), l: tk.linea };
      } else if (this.aceptar('[')) {
        const indice = this.expresion();
        this.esperar(']', 'para cerrar el índice');
        e = { k: 'idx', obj: e, indice, l: tk.linea };
      } else if (this.aceptar('(')) {
        const args: Expr[] = [];
        if (!this.es(')')) {
          do args.push(this.expresion());
          while (this.aceptar(','));
        }
        this.esperar(')', 'para cerrar la llamada');
        e = { k: 'llamada', fn: e, args, l: tk.linea };
      } else if (tk.tipo === 'op' && (tk.valor === '++' || tk.valor === '--')) {
        this.p++;
        e = { k: 'incr', op: tk.valor, prefijo: false, destino: e, l: tk.linea };
      } else {
        return e;
      }
    }
  }

  private primario(): Expr {
    const tk = this.avanzar();
    const l = tk.linea;
    if (tk.tipo === 'num') return { k: 'num', v: Number(tk.valor), l };
    if (tk.tipo === 'str') return { k: 'str', v: tk.valor, l };
    if (tk.tipo === 'kw' && (tk.valor === 'true' || tk.valor === 'false')) return { k: 'bool', v: tk.valor === 'true', l };
    if (tk.tipo === 'kw' && tk.valor === 'null') return { k: 'null', l };
    if (tk.tipo === 'id' || (tk.tipo === 'kw' && tk.valor === 'String')) return { k: 'var', nombre: tk.valor, l };
    if (tk.tipo === 'op' && tk.valor === '(') {
      const e = this.expresion();
      this.esperar(')', 'para cerrar el paréntesis');
      return e;
    }
    if (tk.tipo === 'eof') throw new ErrorJava('SINTAXIS', 'El código terminó antes de tiempo. ¿Falta cerrar algo?', l);
    throw new ErrorJava('SINTAXIS', `No se esperaba "${tk.valor}" aquí.`, l);
  }
}

export function analizar(codigo: string): Stmt {
  return new Parser(tokenizar(codigo)).programa();
}
