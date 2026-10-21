import type { TemaTeoria } from '../../../application/contenido/teoria';
import { Curi } from '../curi/Curi';
import { TableroGaleria } from '../galeria/TableroGaleria';

/** Explicación, código de ejemplo y matriz de demostración de un tema de teoría. */
export function VistaTema({ tema }: { tema: TemaTeoria }) {
  const { demo } = tema;
  const tamano = Math.min(46, Math.floor(300 / Math.max(demo.columnas, demo.filas)));
  return (
    <div className="teoria__cuerpo">
      <div className="teoria__explicacion">
        <p className="teoria__texto">{tema.texto}</p>
        <pre className="teoria__codigo"><code>{tema.codigo}</code></pre>
      </div>
      <aside className="teoria__demo">
        <TableroGaleria
          filas={demo.filas}
          columnas={demo.columnas}
          variante="sala"
          tamanoCelda={tamano}
          visitadas={demo.recorrido}
          correctas={demo.recorrido}
          destino={demo.destino ?? null}
          mostrarOrden
        />
        <p className="texto-pixel teoria__leyenda">{demo.leyenda}</p>
        <div className="teoria__consejo">
          <Curi animo={tema.animo} alto={92} />
          <p className="burbuja teoria__burbuja">{tema.consejo}</p>
        </div>
      </aside>
    </div>
  );
}
