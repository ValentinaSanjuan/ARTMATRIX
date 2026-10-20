export function Letrero({ texto }: { texto: string }) {
  return (
    <div className="letrero">
      <h1 className="titulo-pixel">{texto}</h1>
    </div>
  );
}
