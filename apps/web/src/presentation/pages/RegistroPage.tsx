import { useMutation } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, type DatosRegistro } from '../../application/services/api';
import { useSesion } from '../../application/stores/sesionStore';
import { mensajeDeError } from '../../infrastructure/api/clienteAxios';
import { Curi } from '../components/curi/Curi';
import { Escena } from '../components/ui/Escena';
import { Letrero } from '../components/ui/Letrero';

const CAMPOS: { clave: keyof DatosRegistro; icono: string; texto: string; tipo?: string; requerido?: boolean }[] = [
  { clave: 'nombre', icono: '☺', texto: 'NOMBRE COMPLETO', requerido: true },
  { clave: 'usuario', icono: '@', texto: 'USUARIO', requerido: true },
  { clave: 'correo', icono: '✉', texto: 'CORREO', tipo: 'email', requerido: true },
  { clave: 'contrasena', icono: '🔒', texto: 'CONTRASEÑA (MÍN. 6)', tipo: 'password', requerido: true },
  { clave: 'telefono', icono: '☎', texto: 'TELÉFONO (OPCIONAL)', tipo: 'tel' },
];

/** RF-01 Registrar estudiante (Fig. 7). */
export function RegistroPage() {
  const navigate = useNavigate();
  const iniciar = useSesion((s) => s.iniciar);
  const [datos, setDatos] = useState<DatosRegistro>({ nombre: '', usuario: '', correo: '', contrasena: '' });

  const registro = useMutation({
    mutationFn: () => authApi.registrar(datos),
    onSuccess: (sesion) => {
      iniciar(sesion);
      navigate('/tutorial');
    },
  });

  const [lento, setLento] = useState(false);
  useEffect(() => {
    if (!registro.isPending) { setLento(false); return; }
    const t = setTimeout(() => setLento(true), 4000);
    return () => clearTimeout(t);
  }, [registro.isPending]);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    registro.mutate();
  };

  return (
    <Escena fondo="inicio">
      <div style={{ marginTop: '1vh' }}><Letrero texto="ARTMATRIX" /></div>
      <form onSubmit={enviar} className="marco-metal columna" style={{ width: 'min(470px, 92vw)', margin: '14px auto 0', gap: 8 }}>
        {CAMPOS.map((c) => (
          <label key={c.clave} className="campo-pixel">
            <span aria-hidden>{c.icono}</span>
            <span className="oculto-visual">{c.texto}</span>
            <input
              type={c.tipo ?? 'text'}
              placeholder={c.texto}
              required={c.requerido}
              minLength={c.clave === 'contrasena' ? 6 : undefined}
              value={datos[c.clave] ?? ''}
              onChange={(e) => setDatos({ ...datos, [c.clave]: e.target.value })}
              autoComplete={c.clave === 'contrasena' ? 'new-password' : 'off'}
            />
          </label>
        ))}
        {registro.isError && <p className="mensaje-error" role="alert">{mensajeDeError(registro.error)}</p>}
        {lento && <p className="aviso-pixel" role="status">Despertando el servidor… la primera vez puede tardar hasta 2 minutos.</p>}
        <div className="fila" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="boton-tablon boton-tablon--pequeno" onClick={() => navigate('/login')}>‹ VOLVER</button>
          <button type="submit" className="boton-tablon boton-tablon--verde" disabled={registro.isPending}>
            {registro.isPending ? 'CREANDO…' : 'COMENZAR'}
          </button>
        </div>
      </form>
      <div className="curi-login">
        <Curi animo={registro.isError ? 'pregunta' : 'feliz'} alto={120} />
      </div>
    </Escena>
  );
}
