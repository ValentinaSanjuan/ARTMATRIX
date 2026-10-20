export function Estrellas({ valor, total = 3, tamano = 14 }: { valor: number; total?: number; tamano?: number }) {
  return (
    <span className="estrellas" style={{ fontSize: tamano }} aria-label={`${valor} de ${total} estrellas`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`estrella${i < valor ? ' estrella--llena' : ''}`}>★</span>
      ))}
    </span>
  );
}
