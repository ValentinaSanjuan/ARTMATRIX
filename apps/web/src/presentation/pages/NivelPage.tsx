import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TEMAS_TEORIA, temaDeNivel } from '../../application/contenido/teoria';
import { AYUDA_CODIGO } from '../../application/contenido/textos';
import { useEvaluar, useNivel, useNiveles } from '../../application/hooks/useGaleria';
import { desafiosApi } from '../../application/services/api';
import type { Celda, Desafio, Pista, ResultadoEvaluacion } from '../../domain/models/tipos';
import { claveCelda, escenarioDeNivel, mismaCelda, mover } from '../../domain/rules/galeria';
import { mensajeDeError } from '../../infrastructure/api/clienteAxios';
import { ejecutarJava } from '../../infrastructure/interprete';
import { OBRAS_GALERIA, type AnimoCuri } from '../../infrastructure/recursos';
import { Curi, DialogoCuri } from '../components/curi/Curi';
import { Consola, type LineaConsola } from '../components/editor/Consola';
import { EditorCodigo } from '../components/editor/EditorCodigo';
import { ControlesFlechas } from '../components/galeria/ControlesFlechas';
import { MiniMatriz } from '../components/galeria/MiniMatriz';
import { TableroGaleria, type ObraVisible } from '../components/galeria/TableroGaleria';
import { MenuPrincipal } from '../components/paneles/MenuPrincipal';
import { PanelInformacion } from '../components/paneles/PanelInformacion';
import { PanelNivelCompletado } from '../components/paneles/PanelNivelCompletado';
import { BotonMadera } from '../components/ui/BotonMadera';
import { Escena } from '../components/ui/Escena';
import { Modal } from '../components/ui/Modal';
import { VistaTema } from '../components/teoria/VistaTema';

const PAUSA_ANIMACION_MS = 260;
const hora = () => new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));
const claveDeImagen = (url: string) => url.split('/').pop()?.replace('.png', '') ?? '';

/**
 * Calcula el tamaño de cada celda según el espacio que realmente queda libre,
 * para que el tablero nunca tape el encabezado ni la barra inferior.
 */
function useTamanoCelda(ref: RefObject<HTMLElement>, filas: number, columnas: number, conControles: boolean) {
  const [tam, setTam] = useState(48);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calcular = () => {
      const { width, height } = el.getBoundingClientRect();
      const movil = window.innerWidth <= 760;
      // índices (22px arriba, 28px a cada lado), huecos de 4px, marco y relleno (~44px)
      // En celular la página se desplaza: el alto lo limita la ventana, no el contenedor.
      const altoDisponible = movil ? window.innerHeight * 0.55 : height;
      const alto = (altoDisponible - 80 - 5 * filas) / filas;
      // en los niveles sin código y en pantallas anchas, las flechas comparten la fila con el tablero
      const reserva = conControles && !movil
        ? Math.min(300, Math.max(210, window.innerWidth * 0.24)) + Math.min(80, Math.max(40, window.innerWidth * 0.05)) : 0;
      const ancho = (width - reserva - (movil ? 70 : 96) - 5 * (columnas + 2)) / columnas;
      setTam(Math.max(movil ? 22 : 18, Math.min(84, Math.floor(Math.min(alto, ancho)))));
    };
    calcular();
    const obs = new ResizeObserver(calcular);
    obs.observe(el);
    window.addEventListener('resize', calcular);
    return () => { obs.disconnect(); window.removeEventListener('resize', calcular); };
  }, [ref, filas, columnas, conControles]);
  return tam;
}

/** Sala de la galería con sus desafíos (RF-04 a RF-11, RF-14). */
export function NivelPage() {
  const { id } = useParams();
  const idNivel = Number(id);
  const navigate = useNavigate();
  const { data, error, isLoading } = useNivel(idNivel);
  const { data: niveles } = useNiveles();
  // La misión actual vive en la URL (?mision=2): así el botón "atrás" del navegador
  // y recargar la página mantienen al estudiante en la misma misión.
  const [params, setParams] = useSearchParams();
  const total = data?.desafios.length ?? 0;
  const pedida = Number(params.get('mision'));
  const pendiente = data ? data.desafios.findIndex((d) => !d.superado) : -1;
  const indice: number | null = !data ? null
    : pedida >= 1 && pedida <= total ? pedida - 1
    : pendiente >= 0 ? pendiente : 0;
  const irAMision = (i: number, reemplazar = false) => setParams({ mision: String(i + 1) }, { replace: reemplazar });

  // Sin ?mision en la URL se abre la primera misión pendiente y se fija en la URL,
  // para que no cambie sola cuando el progreso se actualiza.
  useEffect(() => {
    if (data && indice !== null && !(pedida >= 1 && pedida <= total)) irAMision(indice, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pedida, total]);

  if (isLoading || (data && indice === null)) {
    return <Escena fondo="salon"><div className="centrado" style={{ flex: 1 }}><span className="cargando">Abriendo la sala…</span></div></Escena>;
  }
  if (error || !data) {
    // RF-04 / RF-05: sala bloqueada o error de carga → informar y permitir regresar.
    return (
      <Escena fondo="salon">
        <div className="centrado columna" style={{ flex: 1, gap: 20 }}>
          <DialogoCuri mensaje={mensajeDeError(error)} animo="triste" tono="error" alto={150} />
          <button className="boton-tablon" onClick={() => navigate('/inicio')}>VOLVER A LAS SALAS</button>
        </div>
      </Escena>
    );
  }

  const desafio = data.desafios[indice ?? 0];
  const siguienteNivel = niveles?.find((n) => n.orden === data.nivel.orden + 1);

  return (
    <SalaDesafio
      key={`${desafio.id}`}
      idNivel={idNivel}
      ordenNivel={data.nivel.orden}
      nombreNivel={data.nivel.nombre}
      desafio={desafio}
      numero={(indice ?? 0) + 1}
      total={data.desafios.length}
      misiones={data.desafios.map((d) => ({ nombre: d.nombre, superado: d.superado }))}
      onIrAMision={(i) => irAMision(i)}
      onSalas={() => navigate('/inicio')}
      onSiguiente={(r) => {
        if ((indice ?? 0) < data.desafios.length - 1) irAMision((indice ?? 0) + 1);
        else if (r?.siguienteNivel || siguienteNivel) navigate(`/nivel/${r?.siguienteNivel ?? siguienteNivel!.id}`);
        else navigate('/perfil');
      }}
      textoSiguiente={(indice ?? 0) < data.desafios.length - 1 ? 'SIGUIENTE' : siguienteNivel ? 'SIGUIENTE NIVEL' : 'VER PERFIL'}
      onAnterior={() => ((indice ?? 0) > 0 ? irAMision((indice ?? 0) - 1) : navigate('/inicio'))}
    />
  );
}

interface SalaProps {
  idNivel: number;
  ordenNivel: number;
  nombreNivel: string;
  desafio: Desafio;
  numero: number;
  total: number;
  textoSiguiente: string;
  onSiguiente: (r: ResultadoEvaluacion | null) => void;
  onAnterior: () => void;
  misiones: { nombre: string; superado: boolean }[];
  onIrAMision: (i: number) => void;
  onSalas: () => void;
}

function SalaDesafio({ idNivel, ordenNivel, nombreNivel, desafio, numero, total, textoSiguiente, onSiguiente, onAnterior, misiones, onIrAMision, onSalas }: SalaProps) {
  const evaluar = useEvaluar(idNivel);
  const escenario = escenarioDeNivel(ordenNivel);
  const esCodigo = desafio.tipo === 'CODIGO';
  const zonaTablero = useRef<HTMLDivElement>(null);
  const tam = useTamanoCelda(zonaTablero, desafio.filas, desafio.columnas, !esCodigo);
  const intro = desafio.mensajes.find((m) => m.tipo === 'INTRO')?.contenido ?? desafio.descripcion;
  const curiMalvado = ordenNivel === 4;

  // ---- Estado del intento ----
  const iniciadoEn = useRef(new Date().toISOString());
  const movil = desafio.obras.find((o) => desafio.obraMovil && claveDeImagen(o.imagen) === desafio.obraMovil);
  const [posMovil, setPosMovil] = useState<Celda | null>(movil ? { fila: movil.fila, columna: movil.columna } : null);
  const [seleccionada, setSeleccionada] = useState(false);
  const [cursor, setCursor] = useState<Celda>({ fila: 0, columna: 0 });
  const [recorrido, setRecorrido] = useState<Celda[]>([]);
  const [colocadas, setColocadas] = useState<Celda[]>([]);
  const [correctas, setCorrectas] = useState<Celda[]>([]);
  const [errorCelda, setErrorCelda] = useState<Celda | null>(null);
  const [reubicar, setReubicar] = useState<Celda[]>([]);
  const [codigo, setCodigo] = useState(desafio.codigoInicial ?? '');
  const [consola, setConsola] = useState<LineaConsola[]>([]);
  const [lineaError, setLineaError] = useState<{ linea: number; mensaje: string } | null>(null);
  const [ejecutando, setEjecutando] = useState(false);
  const [pistas, setPistas] = useState<Pista[]>([]);
  const [resultado, setResultado] = useState<ResultadoEvaluacion | null>(null);
  const [curi, setCuri] = useState<{ mensaje: string; animo: AnimoCuri; tono: 'normal' | 'error' | 'exito' }>(
    { mensaje: intro, animo: 'feliz', tono: 'normal' });

  // ---- Paneles ----
  const [instrucciones, setInstrucciones] = useState(true);
  const [ayuda, setAyuda] = useState(false);
  const [teoria, setTeoria] = useState(false);
  const temaNivel = TEMAS_TEORIA.find((t) => t.clave === temaDeNivel(ordenNivel))!;
  const [errorPista, setErrorPista] = useState<string | null>(null);
  const [info, setInfo] = useState(false);
  const [menu, setMenu] = useState(false);
  const [completado, setCompletado] = useState(false);

  const superado = resultado?.correcto === true;
  const bloqueado = evaluar.isPending || ejecutando || superado;

  // ---- Obras visibles ----
  const obras: ObraVisible[] = useMemo(() => {
    const lista: ObraVisible[] = desafio.obras
      .filter((o) => o !== movil)
      .map((o) => ({ fila: o.fila, columna: o.columna, imagen: o.imagen, nombre: o.nombre }));
    if (movil && posMovil) lista.push({ ...posMovil, imagen: movil.imagen, nombre: movil.nombre, movil: !superado });
    colocadas.forEach((c, i) => {
      if (!lista.some((o) => mismaCelda(o, c))) {
        lista.push({ ...c, imagen: OBRAS_GALERIA[i % OBRAS_GALERIA.length], nombre: `Obra colocada ${i + 1}` });
      }
    });
    return lista;
  }, [desafio.obras, movil, posMovil, colocadas, superado]);

  const imagenesMini = useMemo(() => new Map(obras.map((o) => [claveCelda(o), o.imagen])), [obras]);

  // ---- Evaluación (servicio de evaluación del backend) ----
  const enviar = (pasos: Celda[], extra?: { codigo: string; salida: string }) => {
    evaluar.mutate(
      { idDesafio: desafio.id, solicitud: { recorrido: pasos, pistasUsadas: pistas.length, iniciadoEn: iniciadoEn.current, ...extra } },
      {
        onSuccess: (r) => {
          setResultado(r);
          if (r.correcto) {
            setCorrectas(pasos);
            setErrorCelda(null);
            setReubicar([]);
            setCuri({ mensaje: r.mensajeCuri, animo: 'celebra', tono: 'exito' });
            if (esCodigo) setConsola((c) => [...c, { tipo: 'ok', texto: `[${hora()}] ¡Solución correcta! +${r.puntos} puntos` }]);
            setTimeout(() => setCompletado(true), esCodigo ? 700 : 450);
          } else {
            const malo = r.indiceError !== null && r.indiceError < pasos.length ? pasos[r.indiceError] : null;
            setErrorCelda(malo);
            if (esCodigo && malo) setReubicar([malo]);
            setCuri({ mensaje: r.mensajeCuri, animo: curiMalvado ? 'alegre' : 'triste', tono: 'error' });
            if (esCodigo) {
              setConsola((c) => [...c, { tipo: 'error', texto: `[Error de lógica] ${r.mensajeCuri}` }]);
            }
          }
        },
        onError: (e) => setCuri({ mensaje: mensajeDeError(e), animo: 'error', tono: 'error' }),
      },
    );
  };

  // ---- UBICAR (RF-06) ----
  const ubicar = (c: Celda) => {
    if (!movil || bloqueado) return;
    if (desafio.obras.some((o) => o !== movil && mismaCelda(o, c))) {
      setCuri({ mensaje: 'Ese espacio ya tiene una obra. Busca otra posición.', animo: 'pregunta', tono: 'error' });
      return;
    }
    setPosMovil(c);
    setCursor(c);
    setSeleccionada(false);
    setResultado(null);
    enviar([c]);
  };

  // ---- RECORRIDO (RF-07) ----
  /** Marca una celda; si ya estaba marcada, la desmarca (deseleccionar). */
  const marcar = (c: Celda) => {
    if (bloqueado) return;
    setCursor(c);
    setErrorCelda(null);
    setResultado(null);
    setRecorrido((r) => (r.some((x) => mismaCelda(x, c)) ? r.filter((x) => !mismaCelda(x, c)) : [...r, c]));
  };

  const deshacer = () => {
    setErrorCelda(null);
    setResultado(null);
    setRecorrido((r) => r.slice(0, -1));
  };

  const soltarSeleccion = () => setSeleccionada(false);

  const alTocarCelda = (c: Celda) => {
    if (desafio.tipo === 'UBICAR') {
      if (posMovil && mismaCelda(c, posMovil)) setSeleccionada((s) => !s); // tocarla otra vez la deselecciona
      else if (seleccionada) ubicar(c);
      else setCursor(c);
    } else if (desafio.tipo === 'RECORRIDO') {
      marcar(c);
    }
  };

  const accionCursor = () => (desafio.tipo === 'UBICAR' ? ubicar(cursor) : marcar(cursor));

  const moverCursor = (df: number, dc: number) => setCursor((c) => mover(c, df, dc, desafio.filas, desafio.columnas));

  // Teclado: flechas para mover a Curi, Enter/Espacio para colocar o marcar.
  useEffect(() => {
    if (esCodigo) return;
    const fn = (e: KeyboardEvent) => {
      if (instrucciones || ayuda || teoria || info || menu || completado) return;
      const mapa: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      if (mapa[e.key]) { e.preventDefault(); moverCursor(...mapa[e.key]); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); accionCursor(); }
      if (e.key === 'Escape') soltarSeleccion();
      if (e.key === 'Backspace' && desafio.tipo === 'RECORRIDO') { e.preventDefault(); deshacer(); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  });

  // ---- CODIGO (RF-10, RF-11) ----
  const ejecutar = async () => {
    if (!codigo.trim()) {
      setConsola([{ tipo: 'error', texto: 'El editor está vacío. Escribe tu solución antes de ejecutar.' }]);
      return;
    }
    setEjecutando(true);
    setColocadas([]);
    setCorrectas([]);
    setReubicar([]);
    setErrorCelda(null);
    setLineaError(null);
    setResultado(null);
    const contenido = Array.from({ length: desafio.filas }, (_, i) =>
      Array.from({ length: desafio.columnas }, (_, j) => desafio.obras.find((o) => o.fila === i && o.columna === j)?.nombre ?? null));
    const r = ejecutarJava(codigo, { filas: desafio.filas, columnas: desafio.columnas, contenido });

    const lineas: LineaConsola[] = [{ tipo: 'info', texto: `[${hora()}] Iniciando recorrido de la matriz…` }];
    setConsola([...lineas]);
    setCuri({ mensaje: 'Ejecutando tu código…', animo: 'piensa', tono: 'normal' });

    if (r.error?.tipo === 'SINTAXIS') {
      setConsola([...lineas, { tipo: 'error', texto: `[Error de sintaxis] Línea ${r.error.linea}: ${r.error.mensaje}` }]);
      setLineaError({ linea: r.error.linea, mensaje: r.error.mensaje });
      setCuri({ mensaje: `Hay un error de sintaxis en la línea ${r.error.linea}. ${r.error.mensaje}`, animo: 'error', tono: 'error' });
      setEjecutando(false);
      return;
    }

    // Representación secuencial del recorrido producido por el código.
    for (let i = 0; i < r.pasos.length; i++) {
      const p = r.pasos[i];
      setColocadas(r.pasos.slice(0, i + 1));
      setCursor(p);
      lineas.push({ tipo: 'salida', texto: `[${hora()}] Colocado en [${p.fila},${p.columna}]` });
      setConsola([...lineas]);
      await espera(PAUSA_ANIMACION_MS);
    }
    r.salida.forEach((s) => lineas.push({ tipo: 'salida', texto: s }));

    if (r.error) {
      lineas.push({ tipo: 'error', texto: `[Error de ejecución] Línea ${r.error.linea}: ${r.error.mensaje}` });
      setConsola([...lineas]);
      setLineaError({ linea: r.error.linea, mensaje: r.error.mensaje });
      setCuri({ mensaje: `Tu programa se detuvo en la línea ${r.error.linea}: ${r.error.mensaje}`, animo: 'error', tono: 'error' });
      setEjecutando(false);
      return;
    }
    if (r.pasos.length === 0) {
      lineas.push({ tipo: 'error', texto: 'Tu programa no colocó ninguna obra. Usa colocar(fila, columna).' });
      setConsola([...lineas]);
      setCuri({ mensaje: 'Tu programa terminó, pero no colocó ninguna obra. ¿Llamaste a colocar(fila, columna)?', animo: 'pregunta', tono: 'error' });
      setEjecutando(false);
      return;
    }
    lineas.push({ tipo: 'info', texto: `[${hora()}] Proceso completado. Verificando solución…` });
    setConsola([...lineas]);
    setEjecutando(false);
    enviar(r.pasos, { codigo, salida: lineas.map((l) => l.texto).join('\n') });
  };

  // ---- Pistas (RF-09) ----
  const pedirPista = async () => {
    setAyuda(true);
    setErrorPista(null);
    if (pistas.length >= desafio.totalPistas) return;
    try {
      const p = await desafiosApi.pista(desafio.id, pistas.length + 1);
      setPistas((ps) => [...ps, p]);
    } catch (e) {
      setErrorPista(mensajeDeError(e));
    }
  };

  const reintentar = () => {
    setPosMovil(movil ? { fila: movil.fila, columna: movil.columna } : null);
    setSeleccionada(false);
    setRecorrido([]);
    setColocadas([]);
    setCorrectas([]);
    setErrorCelda(null);
    setReubicar([]);
    setResultado(null);
    setCompletado(false);
    setLineaError(null);
    setConsola([]);
    setCursor({ fila: 0, columna: 0 });
    iniciadoEn.current = new Date().toISOString();
    setCuri({ mensaje: intro, animo: 'feliz', tono: 'normal' });
  };

  // ---- Interfaz ----
  return (
    <Escena fondo={escenario.fondo} nocturna={desafio.nocturno} oscura={curiMalvado}>
      <header className="encabezado-nivel">
        <BotonMadera icono="menu" etiqueta="MENÚ" onClick={() => setMenu(true)} />
        <div className="encabezado-nivel__texto">
          <h1 className="titulo-pixel encabezado-nivel__titulo">
            Nvl {ordenNivel}. {nombreNivel}
            <span className="encabezado-nivel__desafio">Desafío {numero}/{total}: {desafio.nombre}</span>
          </h1>
          <p className="encabezado-nivel__instrucciones">{desafio.instrucciones}</p>
          {total > 1 && (
            <nav className="selector-misiones" aria-label="Misiones de este nivel">
              {misiones.map((m, i) => (
                <button key={i} type="button" title={m.nombre}
                        className={`selector-misiones__boton${i === numero - 1 ? ' selector-misiones__boton--actual' : ''}${m.superado ? ' selector-misiones__boton--hecha' : ''}`}
                        aria-current={i === numero - 1 ? 'step' : undefined}
                        disabled={ejecutando} onClick={() => i !== numero - 1 && onIrAMision(i)}>
                  {m.superado ? '★' : i + 1}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <div className="nivel-cuerpo">
        <div className="nivel-cuerpo__principal">
          <section className="nivel-zona">
            <div ref={zonaTablero} className="zona-tablero">
              <TableroGaleria
                filas={desafio.filas}
                columnas={desafio.columnas}
                variante={escenario.tablero}
                tamanoCelda={tam}
                baldosas={desafio.baldosas}
                obras={obras}
                visitadas={desafio.tipo === 'RECORRIDO' ? recorrido : esCodigo ? colocadas : []}
                mostrarOrden={!esCodigo || ejecutando}
                correctas={correctas}
                error={errorCelda}
                cursor={desafio.tipo === 'UBICAR' && seleccionada ? posMovil : cursor}
                animoCursor="frente"
                curiLadron={curiMalvado}
                deshabilitado={bloqueado}
                onCelda={esCodigo ? undefined : alTocarCelda}
                onSoltarObra={ubicar}
                onTomarObra={() => setSeleccionada(true)}
              />
              {!esCodigo && (
                <aside className="controles-nivel">
                  <ControlesFlechas onMover={moverCursor} deshabilitado={bloqueado} />
                  <div className="fila" style={{ gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <BotonMadera icono="aceptar" etiqueta={desafio.tipo === 'UBICAR' ? 'COLOCAR AQUÍ' : 'MARCAR'} onClick={accionCursor} disabled={bloqueado} />
                    {desafio.tipo === 'UBICAR' && seleccionada && (
                      <BotonMadera icono="detener" etiqueta="SOLTAR" onClick={soltarSeleccion} disabled={bloqueado} />
                    )}
                    {desafio.tipo === 'RECORRIDO' && (
                      <>
                        <BotonMadera icono="atras" etiqueta="DESHACER" disabled={bloqueado || recorrido.length === 0} onClick={deshacer} />
                        <BotonMadera icono="completado" etiqueta="COMPROBAR" disabled={bloqueado || recorrido.length === 0} onClick={() => enviar(recorrido)} />
                      </>
                    )}
                  </div>
                  <p className="ayuda-controles">
                    {desafio.tipo === 'UBICAR'
                      ? seleccionada
                        ? 'Obra seleccionada: toca la celda de destino, o tócala otra vez (o SOLTAR / Esc) para deseleccionarla.'
                        : 'Toca la obra que flota para seleccionarla (o arrástrala) y luego la celda de destino.'
                      : 'Toca las celdas en orden. Si tocas una celda marcada, se desmarca. DESHACER quita la última.'}
                  </p>
                </aside>
              )}
            </div>
          </section>
          <div style={{ padding: '4px 0 0' }}>
            <DialogoCuri mensaje={curi.mensaje} animo={curi.animo} tono={curi.tono} alto={86} ladron={curiMalvado} />
          </div>
        </div>
        {esCodigo && (
          <aside className="panel-codigo panel-codigo--lateral">
            <div className="panel-codigo__cabecera"><span>Editor de Código — Java</span><span>Galeria.java</span></div>
            <div className="panel-codigo__editor">
              <EditorCodigo valor={codigo} onCambio={setCodigo} lineaError={lineaError?.linea} mensajeError={lineaError?.mensaje} soloLectura={ejecutando} />
            </div>
            <div className="panel-codigo__acciones">
              <button className="boton-run" onClick={ejecutar} disabled={bloqueado}>▶ {ejecutando ? 'Ejecutando…' : 'Run'}</button>
              <button className="boton-codigo" onClick={() => setCodigo(desafio.codigoInicial ?? '')} disabled={bloqueado}>
                {desafio.codigoInicial ? 'Restaurar código' : 'Limpiar editor'}
              </button>
            </div>
            <div className="panel-codigo__inferior">
              <div className="panel-codigo__bloque panel-codigo__bloque--consola">
                <div className="panel-codigo__subtitulo">Consola</div>
                <Consola lineas={consola} />
              </div>
              <div className="panel-codigo__bloque">
                <div className="panel-codigo__subtitulo">Matriz de pinturas</div>
                <MiniMatriz filas={desafio.filas} columnas={desafio.columnas} imagenes={imagenesMini}
                            actual={ejecutando ? cursor : null} correctas={correctas} reubicar={reubicar} />
              </div>
            </div>
          </aside>
        )}
      </div>

      <footer className="barra-inferior">
        <BotonMadera icono="atras" etiqueta={numero > 1 ? 'MISIÓN ANTERIOR' : 'SALAS'} onClick={onAnterior} disabled={ejecutando} />
        <BotonMadera icono="informacion" etiqueta="INFORMACIÓN" onClick={() => setInfo(true)} />
        <BotonMadera icono="cargar" etiqueta="INSTRUCCIONES" onClick={() => setInstrucciones(true)} />
        <BotonMadera icono="reintentar" etiqueta="REINTENTAR" onClick={reintentar} disabled={ejecutando || evaluar.isPending} />
        <BotonMadera icono="ayuda" etiqueta="AYUDA" onClick={pedirPista} disabled={desafio.totalPistas === 0} />
        <span className="barra-inferior__espacio" />
        <BotonMadera icono="siguiente" etiqueta={textoSiguiente} disabled={!superado && !desafio.superado} onClick={() => onSiguiente(resultado)} />
      </footer>

      {instrucciones && (
        <Modal titulo="INSTRUCCIONES" onCerrar={() => setInstrucciones(false)}
               acciones={<>
                 <BotonMadera icono="informacion" etiqueta="VER TEORÍA"
                              onClick={() => { setInstrucciones(false); setTeoria(true); }} />
                 <BotonMadera icono="completado" etiqueta="ENTENDIDO" onClick={() => setInstrucciones(false)} />
               </>}>
          <div className="fila" style={{ alignItems: 'flex-start', gap: 16 }}>
            <div className="columna" style={{ flex: 1 }}>
              <p className="modal-tablero__texto" style={{ margin: 0 }}>{intro}</p>
              <p className="modal-tablero__texto" style={{ margin: 0, color: 'var(--oro)' }}>{desafio.instrucciones}</p>
              {esCodigo && <pre className="consola" style={{ height: 'auto', margin: 0 }}>{AYUDA_CODIGO}</pre>}
            </div>
            <Curi animo="indica" alto={150} ladron={curiMalvado} />
          </div>
        </Modal>
      )}

      {teoria && (
        <Modal titulo={`TEORÍA: ${temaNivel.titulo.toUpperCase()}`} ancho="min(1100px, 96vw)" onCerrar={() => setTeoria(false)}
               acciones={<BotonMadera icono="completado" etiqueta="VOLVER AL NIVEL" onClick={() => setTeoria(false)} />}>
          <VistaTema tema={temaNivel} />
        </Modal>
      )}

      {ayuda && (
        <Modal titulo="AYUDA" onCerrar={() => setAyuda(false)}
               acciones={<>
                 {pistas.length < desafio.totalPistas && (
                   <BotonMadera icono="ayuda" etiqueta="OTRA PISTA" onClick={pedirPista} />
                 )}
                 <BotonMadera icono="completado" etiqueta="ENTENDIDO" onClick={() => setAyuda(false)} />
               </>}>
          <div className="fila" style={{ alignItems: 'flex-start', gap: 16 }}>
            <div className="columna" style={{ flex: 1 }}>
              {pistas.map((p) => (
                <p key={p.orden} className="modal-tablero__texto" style={{ margin: 0 }}>
                  <span style={{ color: 'var(--oro)' }}>Pista {p.orden}:</span> {p.contenido}
                </p>
              ))}
              {errorPista && <p className="mensaje-error">{errorPista}</p>}
              {pistas.length >= desafio.totalPistas && pistas.length > 0 && (
                <p className="texto-pixel" style={{ margin: 0, opacity: 0.85 }}>Ya usaste todas las pistas disponibles para este desafío.</p>
              )}
            </div>
            <Curi animo="indica" alto={150} ladron={curiMalvado} />
          </div>
        </Modal>
      )}

      {completado && resultado && (
        <PanelNivelCompletado
          resultado={resultado}
          titulo={resultado.nivelCompletado ? 'NIVEL COMPLETADO' : '¡DESAFÍO SUPERADO!'}
          textoSiguiente={textoSiguiente}
          onReintentar={reintentar}
          onSalas={onSalas}
          onSiguiente={() => onSiguiente(resultado)}
        />
      )}
      {info && <PanelInformacion onCerrar={() => setInfo(false)} />}
      {menu && <MenuPrincipal onCerrar={() => setMenu(false)} onInformacion={() => setInfo(true)} />}
    </Escena>
  );
}

