import { useEstadoServidor } from '../../../application/services/estadoServidor';

/**
 * Indicador del estado del servidor en el ingreso y el registro (mejora de usabilidad, USR-02):
 * en vez de esperar sin saber qué pasa, el estudiante ve que la galería se está preparando.
 */
export function AvisoServidor() {
  const estado = useEstadoServidor();
  if (estado === 'listo') {
    return <p className="aviso-servidor aviso-servidor--listo" role="status">● Galería lista</p>;
  }
  return (
    <div className="aviso-servidor" role="status" aria-live="polite">
      <span>Preparando la galería… el primer ingreso puede tardar hasta un minuto.</span>
      <span className="aviso-servidor__barra" aria-hidden><span /></span>
    </div>
  );
}
