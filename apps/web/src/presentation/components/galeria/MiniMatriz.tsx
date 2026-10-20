import type { Celda } from '../../../domain/models/tipos';
import { claveCelda } from '../../../domain/rules/galeria';

interface Props {
  filas: number;
  columnas: number;
  imagenes: Map<string, string>;
  actual?: Celda | null;
  correctas?: Celda[];
  reubicar?: Celda[];
}

/** Panel "Matriz de pinturas" del editor (Fig. 13–22). */
export function MiniMatriz({ filas, columnas, imagenes, actual, correctas = [], reubicar = [] }: Props) {
  const ok = new Set(correctas.map(claveCelda));
  const mal = new Set(reubicar.map(claveCelda));
  return (
    <div className="mini-matriz">
      <div className="mini-matriz__grid" style={{ gridTemplateColumns: `14px repeat(${columnas}, 26px)` }}>
        <span />
        {Array.from({ length: columnas }, (_, j) => <span key={`c${j}`} style={{ textAlign: 'center' }}>{j}</span>)}
        {Array.from({ length: filas }, (_, i) => [
          <span key={`f${i}`}>{i}</span>,
          ...Array.from({ length: columnas }, (_, j) => {
            const k = claveCelda({ fila: i, columna: j });
            const cls = ['mini-matriz__celda',
              actual && claveCelda(actual) === k ? 'mini-matriz__celda--actual' : '',
              ok.has(k) ? 'mini-matriz__celda--correcta' : '',
              mal.has(k) ? 'mini-matriz__celda--reubicar' : ''].filter(Boolean).join(' ');
            return <span key={k} className={cls}>{imagenes.get(k) && <img src={imagenes.get(k)} alt="" />}</span>;
          }),
        ])}
      </div>
      <div className="mini-matriz__leyenda">
        <span><i style={{ borderColor: 'var(--azul)' }} />posición actual</span>
        <span><i style={{ borderColor: 'var(--verde)' }} />correcta</span>
        <span><i style={{ borderColor: 'var(--oro)' }} />por reubicar</span>
        <span><i style={{ borderColor: '#2b4a70' }} />vacía</span>
      </div>
    </div>
  );
}
