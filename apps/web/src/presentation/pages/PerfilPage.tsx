import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INFORMACION } from '../../application/contenido/textos';
import { useProgreso } from '../../application/hooks/useGaleria';
import { mensajeDeError } from '../../infrastructure/api/clienteAxios';
import { imgCuri } from '../../infrastructure/recursos';
import { DialogoCuri } from '../components/curi/Curi';
import { MenuPrincipal } from '../components/paneles/MenuPrincipal';
import { PanelInformacion } from '../components/paneles/PanelInformacion';
import { BotonMadera } from '../components/ui/BotonMadera';
import { Escena } from '../components/ui/Escena';
import { Estrellas } from '../components/ui/Estrellas';
import { Letrero } from '../components/ui/Letrero';

/** Perfil del estudiante con progreso, insignias y contacto (Fig. 23; RF-12, RF-13). */
export function PerfilPage() {
  const navigate = useNavigate();
  const { data: p, isLoading, error } = useProgreso();
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState(false);

  return (
    <Escena fondo="exterior">
      <div className="boton-menu"><BotonMadera icono="menu" etiqueta="MENÚ" onClick={() => setMenu(true)} /></div>
      <div style={{ marginTop: '1vh' }}><Letrero texto="PERFIL" /></div>

      {isLoading && <div className="centrado" style={{ flex: 1 }}><span className="cargando">Cargando progreso…</span></div>}
      {error && <div className="centrado" style={{ flex: 1 }}><DialogoCuri mensaje={mensajeDeError(error)} animo="triste" tono="error" /></div>}

      {p && (
        <section className="perfil">
          <article className="tarjeta">
            <div className="perfil-cabecera">
              <div className="perfil-avatar"><img src={imgCuri('saludo_izq')} alt="" /></div>
              <div className="columna" style={{ gap: 6, minWidth: 0 }}>
                <h2 className="perfil-nombre">{p.estudiante.nombre}</h2>
                <span className="perfil-usuario">@{p.estudiante.usuario}</span>
                <span className="chip">★ Nivel {p.nivelActual ?? p.totalNiveles}</span>
              </div>
            </div>
            <div className="columna" style={{ gap: 6 }}>
              <div className="fila" style={{ justifyContent: 'space-between', fontSize: 19 }}>
                <span>Salas completadas</span>
                <b style={{ color: 'var(--oro)' }}>{p.nivelesCompletados}/{p.totalNiveles}</b>
              </div>
              <div className="barra-progreso">
                <div className="barra-progreso__relleno"
                     style={{ width: `${p.totalNiveles ? (p.nivelesCompletados * 100) / p.totalNiveles : 0}%` }} />
              </div>
            </div>
            <div className="estadisticas">
              <div className="estadistica"><b>{p.puntos}</b><span>Puntos</span></div>
              <div className="estadistica"><b>{p.desafiosSuperados}/{p.totalDesafios}</b><span>Desafíos</span></div>
              <div className="estadistica"><b>{p.intentos}</b><span>Intentos</span></div>
            </div>
          </article>

          <article className="tarjeta">
            <h2 className="tarjeta__titulo">▶ SALAS</h2>
            {p.niveles.map((n) => (
              <button key={n.id} type="button" onClick={() => navigate(`/nivel/${n.id}`)}
                      className={`sala-fila${n.estado === 'COMPLETADO' ? ' sala-fila--completada' : ''}`}>
                <span className="sala-fila__numero">{n.estado === 'COMPLETADO' ? '✔' : n.orden}</span>
                <span className="sala-fila__info">
                  <span className="sala-fila__nombre">{n.nombre.split(':')[0]}</span>
                  <span className="barra-progreso"><span className="barra-progreso__relleno" style={{ display: 'block', width: `${n.porcentaje}%` }} /></span>
                </span>
                <Estrellas valor={n.estrellas} tamano={11} />
              </button>
            ))}
            {p.desafiosSuperados === 0 && (
              <p style={{ margin: 0, fontSize: 19, color: 'var(--crema-suave)' }}>
                Aún no registras actividades: puedes empezar por cualquier sala.
              </p>
            )}
          </article>

          <article className="tarjeta">
            <h2 className="tarjeta__titulo">★ INSIGNIAS</h2>
            <div className="insignias">
              {p.recompensas.map((r) => (
                <div key={r.id} className={`insignia${r.obtenida ? ' insignia--obtenida' : ''}`} title={r.descripcion}>
                  <span className="insignia__icono">{r.tipo === 'INSIGNIA' ? '★' : '✦'}</span>
                  <span>{r.nombre}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="tarjeta">
            <h2 className="tarjeta__titulo">✉ CONTACTO</h2>
            <div className="contacto-linea"><i>@</i>{p.estudiante.correo}</div>
            {p.estudiante.telefono && <div className="contacto-linea"><i>☎</i>{p.estudiante.telefono}</div>}
            <p style={{ fontSize: 18, color: 'var(--crema-suave)', margin: 0 }}>
              {INFORMACION.split('\n').slice(-1)[0]}
            </p>
          </article>
        </section>
      )}

      <footer className="barra-inferior">
        <BotonMadera icono="atras" etiqueta="ATRÁS" onClick={() => navigate('/inicio')} />
        <BotonMadera icono="informacion" etiqueta="INFORMACIÓN" onClick={() => setInfo(true)} />
      </footer>
      {menu && <MenuPrincipal onCerrar={() => setMenu(false)} onInformacion={() => setInfo(true)} />}
      {info && <PanelInformacion onCerrar={() => setInfo(false)} />}
    </Escena>
  );
}
