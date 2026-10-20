import { motion } from 'framer-motion';
import { Fragment, type CSSProperties, type DragEvent } from 'react';
import type { Celda } from '../../../domain/models/tipos';
import { claveCelda } from '../../../domain/rules/galeria';
import { imgCuri, type AnimoCuri } from '../../../infrastructure/recursos';

export interface ObraVisible extends Celda {
  imagen: string;
  nombre: string;
  movil?: boolean;
}

interface Props {
  filas: number;
  columnas: number;
  variante: 'sala' | 'estanteria';
  tamanoCelda?: number;
  baldosas?: number[][];
  obras?: ObraVisible[];
  /** Celdas visitadas, en orden (se numeran). */
  visitadas?: Celda[];
  mostrarOrden?: boolean;
  correctas?: Celda[];
  error?: Celda | null;
  destino?: Celda | null;
  cursor?: Celda | null;
  animoCursor?: AnimoCuri;
  /** Curi aparece como ladrón sobre el tablero. */
  curiLadron?: boolean;
  deshabilitado?: boolean;
  onCelda?: (c: Celda) => void;
  onSoltarObra?: (c: Celda) => void;
  onTomarObra?: () => void;
}

/**
 * RF-05: la matriz se representa como espacios de exhibición en filas y columnas,
 * con sus índices visibles y una obra, elemento o espacio vacío en cada celda.
 */
export function TableroGaleria({
  filas, columnas, variante, tamanoCelda = 60, baldosas = [], obras = [], visitadas = [],
  mostrarOrden = true, correctas = [], error, destino, cursor, animoCursor = 'frente', curiLadron = false,
  deshabilitado, onCelda, onSoltarObra, onTomarObra,
}: Props) {
  const madera = new Set(baldosas.map(([f, c]) => `${f}-${c}`));
  const orden = new Map<string, number>();
  visitadas.forEach((c, i) => { if (!orden.has(claveCelda(c))) orden.set(claveCelda(c), i + 1); });
  const ok = new Set(correctas.map(claveCelda));
  const obraEn = new Map(obras.map((o) => [claveCelda(o), o]));

  const indicesColumnas = (
    <>
      <span />
      {Array.from({ length: columnas }, (_, j) => (
        <span key={j} className={`tablero__indice tablero__fila-indices${cursor?.columna === j ? ' tablero__indice--activo' : ''}`}>{j}</span>
      ))}
      <span />
    </>
  );

  const soltar = (e: DragEvent, c: Celda) => {
    e.preventDefault();
    if (!deshabilitado) onSoltarObra?.(c);
  };

  const estilo = { ['--columnas' as string]: columnas, ['--celda' as string]: `${tamanoCelda}px` } as CSSProperties;

  const tablero = (
    <div className={`tablero tablero--${variante}`} style={estilo}>
      {indicesColumnas}
      {Array.from({ length: filas }, (_, i) => (
        <Fragment key={i}>
          <span className={`tablero__indice${cursor?.fila === i ? ' tablero__indice--activo' : ''}`}>{i}</span>
          {Array.from({ length: columnas }, (_, j) => {
            const c = { fila: i, columna: j };
            const k = claveCelda(c);
            const obra = obraEn.get(k);
            const clases = [
              'celda',
              variante === 'estanteria' ? 'celda--estante' : madera.has(k) ? 'celda--madera' : '',
              orden.has(k) ? 'celda--visitada' : '',
              ok.has(k) ? 'celda--correcta' : '',
              error && claveCelda(error) === k ? 'celda--error' : '',
              destino && claveCelda(destino) === k ? 'celda--destino' : '',
              cursor && claveCelda(cursor) === k ? 'celda--cursor' : '',
            ].filter(Boolean).join(' ');
            return (
              <button
                key={k}
                type="button"
                className={clases}
                aria-label={`matriz[${i}][${j}]${obra ? `: ${obra.nombre}` : ''}`}
                title={`matriz[${i}][${j}]`}
                disabled={deshabilitado}
                onClick={() => onCelda?.(c)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => soltar(e, c)}
              >
                {obra && (
                  <span
                    className={`celda__obra${obra.movil ? ' celda__obra--movil' : ' celda__obra--aparece'}`}
                    draggable={!!obra.movil && !deshabilitado}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', 'obra');
                      onTomarObra?.();
                    }}
                  >
                    <img src={obra.imagen} alt={obra.nombre} draggable={false} />
                  </span>
                )}
                {mostrarOrden && orden.has(k) && <span className="celda__orden">{orden.get(k)}</span>}
                {cursor && claveCelda(cursor) === k && (
                  <motion.span className="celda__curi" layoutId="curi-cursor">
                    <img src={imgCuri(animoCursor, curiLadron)} alt="" />
                  </motion.span>
                )}
              </button>
            );
          })}
          <span className={`tablero__indice${cursor?.fila === i ? ' tablero__indice--activo' : ''}`}>{i}</span>
        </Fragment>
      ))}
    </div>
  );

  return <div className={variante === 'estanteria' ? 'estanteria' : 'marco-sala'}>{tablero}</div>;
}
