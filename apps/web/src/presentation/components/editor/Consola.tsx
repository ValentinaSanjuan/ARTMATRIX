import { useEffect, useRef } from 'react';

export interface LineaConsola {
  tipo: 'info' | 'ok' | 'error' | 'salida';
  texto: string;
}

export function Consola({ lineas }: { lineas: LineaConsola[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [lineas]);
  return (
    <div className="consola" ref={ref} aria-live="polite">
      {lineas.length === 0 && <span className="consola__info">La salida de tu programa aparecerá aquí.</span>}
      {lineas.map((l, i) => (
        <div key={i} className={l.tipo === 'salida' ? '' : `consola__${l.tipo}`}>{l.texto}</div>
      ))}
    </div>
  );
}
