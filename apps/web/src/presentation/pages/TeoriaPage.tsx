import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TEMAS_TEORIA } from '../../application/contenido/teoria';
import { MenuPrincipal } from '../components/paneles/MenuPrincipal';
import { PanelInformacion } from '../components/paneles/PanelInformacion';
import { BotonMadera } from '../components/ui/BotonMadera';
import { Escena } from '../components/ui/Escena';
import { VistaTema } from '../components/teoria/VistaTema';

/**
 * Apartado de teoría (opcional): explica matrices y recorridos en Java
 * con un ejemplo de código y una matriz que muestra el orden de visita.
 * Acepta ?tema=<clave> para abrir directamente un tema.
 */
export function TeoriaPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const inicial = Math.max(0, TEMAS_TEORIA.findIndex((t) => t.clave === params.get('tema')));
  const [indice, setIndice] = useState(inicial);
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState(false);

  const tema = TEMAS_TEORIA[indice];

  return (
    <Escena fondo="salon">
      <div className="boton-menu"><BotonMadera icono="menu" etiqueta="MENÚ" onClick={() => setMenu(true)} /></div>

      <div className="teoria">
        <nav className="teoria__temas" aria-label="Temas de teoría">
          <span className="titulo-pixel teoria__temas-titulo">TEORÍA</span>
          {TEMAS_TEORIA.map((t, i) => (
            <button
              key={t.clave}
              className={`boton-tablon boton-tablon--pequeno teoria__tema${i === indice ? ' teoria__tema--activo' : ''}`}
              onClick={() => setIndice(i)}
              aria-current={i === indice}
            >
              <span>{i + 1}. {t.titulo}</span>
              {t.nivel && <span className="teoria__nivel">NIVEL {t.nivel}</span>}
            </button>
          ))}
        </nav>

        <article className="teoria__contenido" key={tema.clave}>
          <header className="teoria__cabecera">
            <h2 className="titulo-pixel teoria__titulo">{tema.titulo.toUpperCase()}</h2>
            <span className="texto-pixel teoria__contador">{indice + 1} / {TEMAS_TEORIA.length}</span>
          </header>
          <VistaTema tema={tema} />
        </article>
      </div>

      <footer className="barra-inferior">
        <BotonMadera icono="atras" etiqueta="ANTERIOR" disabled={indice === 0} onClick={() => setIndice(indice - 1)} />
        <BotonMadera icono="informacion" etiqueta="INFORMACIÓN" onClick={() => setInfo(true)} />
        <span className="barra-inferior__espacio" />
        <BotonMadera icono="completado" etiqueta="IR A LAS SALAS" onClick={() => navigate('/inicio')} />
        <BotonMadera icono="siguiente" etiqueta="SIGUIENTE" disabled={indice === TEMAS_TEORIA.length - 1}
                     onClick={() => setIndice(indice + 1)} />
      </footer>

      {menu && <MenuPrincipal onCerrar={() => setMenu(false)} onInformacion={() => setInfo(true)} />}
      {info && <PanelInformacion onCerrar={() => setInfo(false)} />}
    </Escena>
  );
}
