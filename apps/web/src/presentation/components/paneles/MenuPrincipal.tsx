import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNiveles } from '../../../application/hooks/useGaleria';
import { useSesion } from '../../../application/stores/sesionStore';
import { Estrellas } from '../ui/Estrellas';

interface Props {
  onCerrar: () => void;
  onInformacion: () => void;
}

/** Menú principal desplegado (Fig. 9). */
export function MenuPrincipal({ onCerrar, onInformacion }: Props) {
  const navigate = useNavigate();
  const cerrarSesion = useSesion((s) => s.cerrar);
  const { data: niveles } = useNiveles();

  const ir = (ruta: string) => {
    onCerrar();
    navigate(ruta);
  };

  return (
    <div className="modal-fondo" style={{ justifyContent: 'flex-start' }} onClick={onCerrar} role="presentation">
      <motion.nav
        className="panel--plano columna"
        style={{ width: 300, maxHeight: '92vh', overflow: 'auto', gap: 10 }}
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        onClick={(e) => e.stopPropagation()}
        aria-label="Menú principal"
      >
        <div className="fila" style={{ justifyContent: 'space-between' }}>
          <span className="titulo-pixel" style={{ fontSize: 13 }}>MENÚ PRINCIPAL</span>
          <button className="boton-tablon boton-tablon--pequeno" onClick={onCerrar} aria-label="Cerrar menú">X</button>
        </div>
        <button className="boton-tablon" onClick={() => ir('/inicio')}>INICIO</button>
        <button className="boton-tablon" onClick={() => ir('/perfil')}>PERFIL</button>
        <button className="boton-tablon" onClick={() => ir('/tutorial')}>TUTORIAL</button>
        <button className="boton-tablon" onClick={() => ir('/teoria')}>TEORÍA</button>
        <button className="boton-tablon" onClick={() => { cerrarSesion(); ir('/login'); }}>SALIR</button>
        <span className="titulo-pixel" style={{ fontSize: 11, marginTop: 6 }}>SELECCIÓN DE NIVEL</span>
        {niveles?.map((n) => (
          <button
            key={n.id}
            className="boton-tablon boton-tablon--pequeno"
            style={{ justifyContent: 'space-between' }}
            disabled={n.estado === 'BLOQUEADO'}
            title={n.requisito ?? n.nombre}
            onClick={() => ir(`/nivel/${n.id}`)}
          >
            <span>{n.estado === 'BLOQUEADO' ? '🔒 ' : ''}Nivel {n.orden}</span>
            <Estrellas valor={n.estrellas} tamano={11} />
          </button>
        ))}
        <button className="boton-tablon" onClick={() => { onCerrar(); onInformacion(); }}>INFORMACIÓN</button>
      </motion.nav>
    </div>
  );
}
