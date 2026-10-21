import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNiveles } from '../../application/hooks/useGaleria';
import { useSesion } from '../../application/stores/sesionStore';
import type { NivelResumen } from '../../domain/models/tipos';
import { mensajeDeError } from '../../infrastructure/api/clienteAxios';
import { Curi, DialogoCuri } from '../components/curi/Curi';
import { MenuPrincipal } from '../components/paneles/MenuPrincipal';
import { PanelInformacion } from '../components/paneles/PanelInformacion';
import { BotonMadera } from '../components/ui/BotonMadera';
import { Escena } from '../components/ui/Escena';
import { Estrellas } from '../components/ui/Estrellas';
import { Letrero } from '../components/ui/Letrero';

/** Pantalla de inicio con las salas disponibles, completadas y bloqueadas (Fig. 8; RF-04). */
export function InicioPage() {
  const navigate = useNavigate();
  const estudiante = useSesion((s) => s.sesion?.estudiante);
  const { data: niveles, isLoading, error } = useNiveles();
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const abrir = (n: NivelResumen) => {
    if (n.estado === 'BLOQUEADO') setAviso(n.requisito);
    else navigate(`/nivel/${n.id}`);
  };

  const mensaje = aviso
    ?? (error ? mensajeDeError(error)
      : !estudiante?.tutorialCompletado ? `¡Hola, ${estudiante?.nombre.split(' ')[0] ?? ''}! Te recomiendo empezar por "Conoce a Curi". La TEORÍA es opcional.`
      : 'Elige una sala para continuar tu aventura. Si quieres repasar los conceptos, entra a TEORÍA.');

  return (
    <Escena fondo="salon">
      <div className="boton-menu"><BotonMadera icono="menu" etiqueta="MENÚ" onClick={() => setMenu(true)} /></div>
      <div style={{ marginTop: '2vh' }}><Letrero texto="ARTMATRIX: INICIO" /></div>

      <section className="fila" style={{ flex: 1, justifyContent: 'center', gap: '4vw', flexWrap: 'wrap', padding: '0 4vw' }}>
        <div className="inicio-accesos">
          <button className="panel--plano fila" style={{ cursor: 'pointer', gap: 14 }} onClick={() => navigate('/tutorial')}>
            <Curi animo="saludo_izq" alto={110} />
            <span className="titulo-pixel" style={{ fontSize: 'clamp(14px, 1.9vw, 24px)', lineHeight: 1.6 }}>
              CONOCE A<br /><span style={{ color: 'var(--oro)' }}>CURI</span>
            </span>
          </button>
          <button className="panel--plano fila" style={{ cursor: 'pointer', gap: 14 }} onClick={() => navigate('/teoria')}>
            <Curi animo="piensa" alto={110} flotando={false} />
            <span className="titulo-pixel" style={{ fontSize: 'clamp(14px, 1.9vw, 24px)', lineHeight: 1.6, textAlign: 'left' }}>
              <span style={{ color: 'var(--oro)' }}>TEORÍA</span><br />
              <span style={{ fontSize: '0.55em' }}>(OPCIONAL)</span>
            </span>
          </button>
        </div>

        <div className="columna" style={{ gap: 14 }}>
          {isLoading && <span className="cargando">Cargando salas…</span>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(170px, 1fr))', gap: 14 }}>
            {niveles?.map((n) => (
              <button
                key={n.id}
                className={`boton-tablon${n.estado === 'COMPLETADO' ? ' boton-tablon--verde' : ''}`}
                style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6, opacity: n.estado === 'BLOQUEADO' ? 0.7 : 1,
                         gridColumn: n.orden === 5 ? '1 / -1' : undefined, justifySelf: n.orden === 5 ? 'center' : undefined }}
                onClick={() => abrir(n)}
                title={n.requisito ?? n.descripcion}
              >
                <span>{n.estado === 'BLOQUEADO' ? '🔒' : '▶'} NIVEL {n.orden}</span>
                <span className="fila" style={{ gap: 8 }}>
                  <Estrellas valor={n.estrellas} tamano={12} />
                  <span style={{ fontSize: 9 }}>{n.estado === 'COMPLETADO' ? 'COMPLETADO' : n.estado === 'BLOQUEADO' ? 'BLOQUEADO' : `${Math.round(n.porcentaje)}%`}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{ padding: '0 4vw 8px' }}>
        <DialogoCuri mensaje={mensaje} animo={aviso ? 'pregunta' : 'feliz'} alto={90} tono={aviso || error ? 'error' : 'normal'} />
      </div>
      <footer className="barra-inferior">
        <BotonMadera icono="informacion" etiqueta="INFORMACIÓN" onClick={() => setInfo(true)} />
        <span className="barra-inferior__espacio" />
        <BotonMadera icono="cargar" etiqueta="PERFIL" onClick={() => navigate('/perfil')} />
      </footer>

      {menu && <MenuPrincipal onCerrar={() => setMenu(false)} onInformacion={() => setInfo(true)} />}
      {info && <PanelInformacion onCerrar={() => setInfo(false)} />}
    </Escena>
  );
}
