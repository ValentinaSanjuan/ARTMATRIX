import type { ButtonHTMLAttributes } from 'react';
import { imgBoton, type IconoBoton } from '../../../infrastructure/recursos';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icono: IconoBoton;
  etiqueta: string;
  alto?: number;
}

/** Botón de madera con los sprites de ImagenesArtMatrix/btn.png. */
export function BotonMadera({ icono, etiqueta, alto = 46, ...resto }: Props) {
  return (
    <button type="button" className="boton-madera" style={{ ['--alto' as string]: `${alto}px` }} title={etiqueta} {...resto}>
      <img src={imgBoton(icono)} alt="" />
      <span>{etiqueta}</span>
    </button>
  );
}
