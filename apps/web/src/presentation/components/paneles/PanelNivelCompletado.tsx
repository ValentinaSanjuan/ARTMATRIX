import { motion } from 'framer-motion';
import type { ResultadoEvaluacion } from '../../../domain/models/tipos';
import { Curi } from '../curi/Curi';
import { BotonMadera } from '../ui/BotonMadera';

interface Props {
  resultado: ResultadoEvaluacion;
  titulo: string;
  onReintentar: () => void;
  onSiguiente: () => void;
  onSalas: () => void;
  textoSiguiente: string;
}

/** Mensaje de nivel completado con estrellas y recompensas (Fig. 15, 20; RF-12). */
export function PanelNivelCompletado({ resultado, titulo, onReintentar, onSiguiente, onSalas, textoSiguiente }: Props) {
  return (
    <div className="modal-fondo" role="dialog" aria-label={titulo}>
      <motion.div className="columna centrado" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  style={{ gap: 14 }}>
        <div className="fila" style={{ gap: 6 }}>
          {[1, 2, 3].map((i) => (
            <motion.span key={i} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }}
                         transition={{ delay: 0.25 * i, type: 'spring' }}
                         className={`estrella${i <= resultado.estrellas ? ' estrella--llena' : ''}`}
                         style={{ fontSize: 64, fontFamily: 'var(--fuente-titulo)' }}>★</motion.span>
          ))}
        </div>
        <h2 className="titulo-pixel" style={{ fontSize: 'clamp(20px, 3.4vw, 40px)', color: 'var(--oro)' }}>{titulo}</h2>
        <div className="panel--plano fila panel-completado__cuerpo">
          <Curi animo="celebra" alto={150} />
          <div className="columna" style={{ gap: 8, maxWidth: 380 }}>
            <p className="texto-pixel" style={{ margin: 0 }}>{resultado.mensajeCuri}</p>
            <p className="titulo-pixel" style={{ fontSize: 13, color: 'var(--oro)' }}>+{resultado.puntos} PUNTOS</p>
            {resultado.recompensasNuevas.map((r) => (
              <motion.div key={r.id} className="fila" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.9 }}>
                <span className="insignia insignia--obtenida" style={{ width: 48 }}>
                  <span className="insignia__icono">{r.tipo === 'INSIGNIA' ? '★' : '✦'}</span>
                </span>
                <span className="texto-pixel">¡Nueva {r.tipo === 'INSIGNIA' ? 'insignia' : 'logro'}: {r.nombre}!</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="fila panel-completado__acciones">
          <BotonMadera icono="menu" etiqueta="SALAS" alto={64} onClick={onSalas} />
          <BotonMadera icono="reintentar" etiqueta="REINTENTAR" alto={64} onClick={onReintentar} />
          <BotonMadera icono="siguiente" etiqueta={textoSiguiente} alto={64} onClick={onSiguiente} />
        </div>
      </motion.div>
    </div>
  );
}
