import { imgFlecha } from '../../../infrastructure/recursos';

interface Props {
  onMover: (df: number, dc: number) => void;
  deshabilitado?: boolean;
}

/** Flechas de madera de los mockups (Fig. 11–12) para mover a Curi por la matriz. */
export function ControlesFlechas({ onMover, deshabilitado }: Props) {
  const flecha = (dir: 'arriba' | 'abajo' | 'izquierda' | 'derecha', df: number, dc: number, etiqueta: string) => (
    <button type="button" className="boton-madera" style={{ ['--alto' as string]: '48px' }} disabled={deshabilitado}
            onClick={() => onMover(df, dc)} title={etiqueta}>
      <img src={imgFlecha(dir)} alt="" />
      <span>{etiqueta}</span>
    </button>
  );
  return (
    <div className="flechas">
      <span />{flecha('arriba', -1, 0, 'ARRIBA')}<span />
      {flecha('izquierda', 0, -1, 'IZQUIERDA')}<span />{flecha('derecha', 0, 1, 'DERECHA')}
      <span />{flecha('abajo', 1, 0, 'ABAJO')}<span />
    </div>
  );
}
