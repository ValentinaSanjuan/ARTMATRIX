// Intérprete propio v1.0 — analizador léxico de un subconjunto de Java.

export type TipoToken = 'num' | 'str' | 'id' | 'kw' | 'op' | 'eof';

export interface Token {
  tipo: TipoToken;
  valor: string;
  linea: number;
}

export class ErrorJava extends Error {
  constructor(
    public readonly tipo: 'SINTAXIS' | 'EJECUCION',
    mensaje: string,
    public readonly linea: number,
  ) {
    super(mensaje);
  }
}

const PALABRAS = new Set([
  'public', 'private', 'protected', 'static', 'final', 'class', 'void',
  'int', 'boolean', 'String', 'var', 'double', 'char', 'long',
  'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'return',
  'true', 'false', 'null', 'new',
]);

// Ordenados de mayor a menor longitud para reconocer primero los compuestos.
const OPERADORES = [
  '>>>=', '<<=', '>>=', '>>>',
  '++', '--', '+=', '-=', '*=', '/=', '%=', '==', '!=', '<=', '>=', '&&', '||',
  '+', '-', '*', '/', '%', '<', '>', '=', '!', '(', ')', '{', '}', '[', ']', ';', ',', '.', '?', ':',
];

export function tokenizar(codigo: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let linea = 1;

  while (i < codigo.length) {
    const c = codigo[i];

    if (c === '\n') { linea++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }

    // Comentarios
    if (c === '/' && codigo[i + 1] === '/') {
      while (i < codigo.length && codigo[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && codigo[i + 1] === '*') {
      const inicio = linea;
      i += 2;
      while (i < codigo.length && !(codigo[i] === '*' && codigo[i + 1] === '/')) {
        if (codigo[i] === '\n') linea++;
        i++;
      }
      if (i >= codigo.length) throw new ErrorJava('SINTAXIS', 'Comentario /* sin cerrar.', inicio);
      i += 2;
      continue;
    }

    // Números (enteros y decimales simples)
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < codigo.length && /[0-9_]/.test(codigo[j])) j++;
      if (codigo[j] === '.' && /[0-9]/.test(codigo[j + 1] ?? '')) {
        j++;
        while (j < codigo.length && /[0-9]/.test(codigo[j])) j++;
      }
      tokens.push({ tipo: 'num', valor: codigo.slice(i, j).replace(/_/g, ''), linea });
      i = j;
      continue;
    }

    // Cadenas
    if (c === '"') {
      let j = i + 1;
      let texto = '';
      while (j < codigo.length && codigo[j] !== '"') {
        if (codigo[j] === '\n') throw new ErrorJava('SINTAXIS', 'Cadena de texto sin cerrar: falta ".', linea);
        if (codigo[j] === '\\' && j + 1 < codigo.length) {
          const e = codigo[j + 1];
          texto += e === 'n' ? '\n' : e === 't' ? '\t' : e;
          j += 2;
          continue;
        }
        texto += codigo[j++];
      }
      if (j >= codigo.length) throw new ErrorJava('SINTAXIS', 'Cadena de texto sin cerrar: falta ".', linea);
      tokens.push({ tipo: 'str', valor: texto, linea });
      i = j + 1;
      continue;
    }

    // Caracter 'x' (se trata como texto)
    if (c === "'") {
      const fin = codigo.indexOf("'", i + 1);
      if (fin < 0 || fin - i > 3) throw new ErrorJava('SINTAXIS', "Carácter sin cerrar: falta '.", linea);
      tokens.push({ tipo: 'str', valor: codigo.slice(i + 1, fin).replace(/^\\/, ''), linea });
      i = fin + 1;
      continue;
    }

    // Identificadores y palabras reservadas
    if (/[A-Za-z_$áéíóúÁÉÍÓÚñÑ]/.test(c)) {
      let j = i;
      while (j < codigo.length && /[A-Za-z0-9_$áéíóúÁÉÍÓÚñÑ]/.test(codigo[j])) j++;
      const palabra = codigo.slice(i, j);
      tokens.push({ tipo: PALABRAS.has(palabra) ? 'kw' : 'id', valor: palabra, linea });
      i = j;
      continue;
    }

    const op = OPERADORES.find((o) => codigo.startsWith(o, i));
    if (op) {
      tokens.push({ tipo: 'op', valor: op, linea });
      i += op.length;
      continue;
    }

    throw new ErrorJava('SINTAXIS', `Símbolo no reconocido: "${c}".`, linea);
  }

  tokens.push({ tipo: 'eof', valor: '', linea });
  return tokens;
}
