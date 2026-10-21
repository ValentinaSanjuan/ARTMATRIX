import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  titulo: string;
  children: ReactNode;
  acciones?: ReactNode;
  onCerrar?: () => void;
  /** Ancho CSS opcional (por defecto el del tablero). */
  ancho?: string;
}

/** Tablero metálico de los paneles de Instrucciones, Ayuda e Información (Fig. 13, 16, 17). */
export function Modal({ titulo, children, acciones, onCerrar, ancho }: Props) {
  return (
    <div className="modal-fondo" onClick={onCerrar} role="presentation">
      <motion.section
        className="modal-tablero"
        role="dialog"
        aria-label={titulo}
        style={ancho ? { width: ancho } : undefined}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-tablero__titulo">{titulo}</h2>
        {children}
        {acciones && <div className="modal-tablero__acciones">{acciones}</div>}
      </motion.section>
    </div>
  );
}
