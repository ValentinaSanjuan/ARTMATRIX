import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGINAS_TUTORIAL } from '../../application/contenido/textos';
import { useCompletarTutorial } from '../../application/hooks/useGaleria';
import { useSesion } from '../../application/stores/sesionStore';
import type { Celda } from '../../domain/models/tipos';
import { mismaCelda } from '../../domain/rules/galeria';
import { imgObra, type AnimoCuri } from '../../infrastructure/recursos';
import { Curi } from '../components/curi/Curi';
import { TableroGaleria } from '../components/galeria/TableroGaleria';
import { MenuPrincipal } from '../components/paneles/MenuPrincipal';
import { PanelInformacion } from '../components/paneles/PanelInformacion';
import { BotonMadera } from '../components/ui/BotonMadera';
import { Escena } from '../components/ui/Escena';
import { Modal } from '../components/ui/Modal';

const OBJETIVO: Celda = { fila: 1, columna: 2 };

/** RF-03 Presentar tutorial e introducción de Curi (Fig. 10). */
export function TutorialPage() {
  const navigate = useNavigate();
  const { paginaTutorial, guardarPaginaTutorial, actualizarEstudiante } = useSesion();
  const completar = useCompletarTutorial();
  const [pagina, setPagina] = useState(Math.min(paginaTutorial, PAGINAS_TUTORIAL.length - 1));
  const [toque, setToque] = useState<Celda | null>(null);
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState(false);
  const [fin, setFin] = useState(false);

  const actual = PAGINAS_TUTORIAL[pagina];
  const demo = 'demo' in actual ? actual.demo : undefined;
  const acerto = toque !== null && mismaCelda(toque, OBJETIVO);
  const bloqueada = demo === 'interaccion' && !acerto;

  const irA = (p: number) => {
    setPagina(p);
    guardarPaginaTutorial(p); // permite retomar el tutorial si se abandona
  };

  const siguiente = () => {
    if (pagina < PAGINAS_TUTORIAL.length - 1) return irA(pagina + 1);
    completar.mutate(undefined, {
      onSettled: () => {
        actualizarEstudiante({ tutorialCompletado: true });
        guardarPaginaTutorial(0);
        setFin(true); // la teoría es opcional: el estudiante elige si la ve antes de jugar
      },
    });
  };

  let texto: string = actual.texto;
  let animo = actual.animo as AnimoCuri;
  if (demo === 'interaccion' && toque) {
    texto = acerto
      ? '¡Exacto! Esa es matriz[1][2]: fila 1, columna 2.\n\nYa conoces los controles básicos de la galería. Presiona COMENZAR para iniciar nuestra primera aventura.'
      : `Esa es matriz[${toque.fila}][${toque.columna}]. Recuerda: primero la fila (horizontal) y luego la columna. Busca matriz[1][2].`;
    animo = acerto ? 'celebra' : 'pregunta';
  }

  return (
    <Escena fondo="salon">
      <div className="boton-menu"><BotonMadera icono="menu" etiqueta="MENÚ" onClick={() => setMenu(true)} /></div>
      <section className="fila tutorial-cuerpo" style={{ flex: 1, justifyContent: 'center', gap: '3vw', padding: '70px 4vw 0', flexWrap: 'wrap' }}>
        <div className="modal-tablero" style={{ width: 'min(560px, 92vw)', maxHeight: '70vh' }}>
          <h2 className="modal-tablero__titulo" style={{ fontSize: 13 }}>{actual.titulo.toUpperCase()}</h2>
          <p className="modal-tablero__texto">{texto}</p>
          <p className="texto-pixel" style={{ textAlign: 'right', margin: '10px 0 0', opacity: 0.8 }}>
            {pagina + 1} / {PAGINAS_TUTORIAL.length}
          </p>
        </div>
        <div className="columna centrado" style={{ gap: 18 }}>
          {demo && (
            <TableroGaleria
              filas={3}
              columnas={4}
              variante="sala"
              tamanoCelda={58}
              baldosas={demo === 'filas-columnas' ? [[1, 0], [1, 1], [1, 2], [1, 3]] : []}
              obras={demo === 'obra' ? [{ fila: 2, columna: 1, imagen: imgObra('noche-estrellada'), nombre: 'La noche estrellada' }] : []}
              destino={demo === 'indices' ? { fila: 0, columna: 0 } : demo === 'obra' ? { fila: 2, columna: 1 } : null}
              visitadas={toque ? [toque] : []}
              correctas={acerto ? [OBJETIVO] : []}
              error={toque && !acerto ? toque : null}
              mostrarOrden={false}
              onCelda={demo === 'interaccion' ? setToque : undefined}
            />
          )}
          {demo === 'filas-columnas' && <p className="texto-pixel" style={{ margin: 0 }}>La fila 1 está resaltada en madera.</p>}
          {demo === 'indices' && <p className="texto-pixel" style={{ margin: 0 }}>La celda dorada es matriz[0][0].</p>}
          <Curi animo={animo} alto={demo ? 140 : 260} />
        </div>
      </section>
      <footer className="barra-inferior">
        <BotonMadera icono="atras" etiqueta={pagina === 0 ? 'SALAS' : 'ATRÁS'} onClick={() => (pagina === 0 ? navigate('/inicio') : irA(pagina - 1))} />
        <BotonMadera icono="informacion" etiqueta="INFORMACIÓN" onClick={() => setInfo(true)} />
        <span className="barra-inferior__espacio" />
        <BotonMadera icono="siguiente" etiqueta={pagina === PAGINAS_TUTORIAL.length - 1 ? 'COMENZAR' : 'SIGUIENTE'}
                     disabled={bloqueada || completar.isPending} onClick={siguiente} />
      </footer>
      {menu && <MenuPrincipal onCerrar={() => setMenu(false)} onInformacion={() => setInfo(true)} />}
      {info && <PanelInformacion onCerrar={() => setInfo(false)} />}
      {fin && (
        <Modal titulo="¿REPASAMOS LA TEORÍA?"
               acciones={<>
                 <BotonMadera icono="informacion" etiqueta="VER TEORÍA" onClick={() => navigate('/teoria')} />
                 <BotonMadera icono="siguiente" etiqueta="IR A LAS SALAS" onClick={() => navigate('/inicio')} />
               </>}>
          <div className="fila" style={{ alignItems: 'center', gap: 16 }}>
            <p className="modal-tablero__texto" style={{ margin: 0, flex: 1 }}>
              {'Antes de empezar puedes leer la TEORÍA: matrices, índices, recorridos y condiciones en Java, con ejemplos.\n\nEs opcional. También la encuentras en el inicio y en el menú cuando la necesites.'}
            </p>
            <Curi animo="piensa" alto={140} />
          </div>
        </Modal>
      )}
    </Escena>
  );
}
