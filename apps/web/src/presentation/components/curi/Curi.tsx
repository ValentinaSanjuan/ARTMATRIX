import { AnimatePresence, motion } from 'framer-motion';
import { imgCuri, type AnimoCuri } from '../../../infrastructure/recursos';

interface Props {
  animo?: AnimoCuri;
  alto?: number;
  flotando?: boolean;
  /** Muestra a Curi disfrazado de ladrón. */
  ladron?: boolean;
}

/** Curi, el guía virtual de la galería (RF-14). Usa los sprites de ImagenesArtMatrix. */
export function Curi({ animo = 'frente', alto = 160, flotando = true, ladron = false }: Props) {
  return (
    <motion.div
      className="curi"
      style={{ height: alto }}
      animate={flotando ? { y: [0, -5, 0] } : undefined}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={`${ladron ? 'l-' : ''}${animo}`}
          src={imgCuri(animo, ladron)}
          alt={ladron ? `Curi ladrón (${animo})` : `Curi (${animo})`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        />
      </AnimatePresence>
    </motion.div>
  );
}

interface DialogoProps extends Props {
  mensaje: string;
  tono?: 'normal' | 'error' | 'exito';
}

export function DialogoCuri({ mensaje, tono = 'normal', ...curi }: DialogoProps) {
  return (
    <div className="dialogo-curi">
      <Curi {...curi} />
      <AnimatePresence mode="wait">
        <motion.p
          key={mensaje}
          className={`burbuja${tono !== 'normal' ? ` burbuja--${tono}` : ''}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {mensaje}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
