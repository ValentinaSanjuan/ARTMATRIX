import { INFORMACION } from '../../../application/contenido/textos';
import { Modal } from '../ui/Modal';
import { BotonMadera } from '../ui/BotonMadera';

/** Panel de Información (Fig. 17). */
export function PanelInformacion({ onCerrar }: { onCerrar: () => void }) {
  return (
    <Modal titulo="INFORMACIÓN" onCerrar={onCerrar}
           acciones={<BotonMadera icono="completado" etiqueta="ACEPTAR" onClick={onCerrar} />}>
      <p className="texto-pixel" style={{ whiteSpace: 'pre-line', margin: 0 }}>{INFORMACION}</p>
    </Modal>
  );
}
