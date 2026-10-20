import type { ReactNode } from 'react';

interface Props {
  fondo: 'exterior' | 'salon' | 'sala' | 'casa';
  nocturna?: boolean;
  /** Filtro oscuro (nivel 4, Curi ladrón). */
  oscura?: boolean;
  children: ReactNode;
}

export function Escena({ fondo, nocturna, oscura, children }: Props) {
  return (
    <main className={`escena escena--${fondo}${nocturna ? ' escena--nocturna' : ''}${oscura ? ' escena--oscura' : ''}`}>
      {children}
    </main>
  );
}
