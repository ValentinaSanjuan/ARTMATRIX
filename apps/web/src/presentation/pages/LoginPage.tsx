import { useMutation } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../../application/services/api';
import { useSesion } from '../../application/stores/sesionStore';
import { mensajeDeError } from '../../infrastructure/api/clienteAxios';
import { Curi } from '../components/curi/Curi';
import { Escena } from '../components/ui/Escena';
import { Letrero } from '../components/ui/Letrero';

/** RF-02 Iniciar sesión (Fig. 6). */
export function LoginPage() {
  const navigate = useNavigate();
  const iniciar = useSesion((s) => s.iniciar);
  const yaConectado = useSesion((s) => s.sesion);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [lento, setLento] = useState(false);
  const [despedida, setDespedida] = useState(false);

  const login = useMutation({
    mutationFn: () => authApi.login(usuario, contrasena),
    onSuccess: (sesion) => {
      iniciar(sesion);
      navigate(sesion.estudiante.tutorialCompletado ? '/inicio' : '/tutorial');
    },
  });

  // El servidor gratuito se duerme: si tarda, se avisa en vez de dejar el botón "colgado".
  useEffect(() => {
    if (!login.isPending) { setLento(false); return; }
    const t = setTimeout(() => setLento(true), 4000);
    return () => clearTimeout(t);
  }, [login.isPending]);

  const salir = () => {
    window.close(); // solo funciona si la pestaña la abrió un script
    setDespedida(true);
  };

  if (yaConectado) return <Navigate to="/inicio" replace />;

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    login.mutate();
  };

  return (
    <Escena fondo="exterior">
      <div style={{ marginTop: '2vh' }}><Letrero texto="ARTMATRIX" /></div>
      <form onSubmit={enviar} className="marco-metal columna" style={{ width: 'min(430px, 92vw)', margin: '18px auto 0' }}>
        <label className="campo-pixel">
          <span aria-hidden>☺</span>
          <span className="oculto-visual">Usuario o correo</span>
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="USUARIO O CORREO" autoComplete="username" required />
        </label>
        <label className="campo-pixel">
          <span aria-hidden>🔒</span>
          <span className="oculto-visual">Contraseña</span>
          <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="CONTRASEÑA" autoComplete="current-password" required />
        </label>
        {login.isError && <p className="mensaje-error" role="alert">{mensajeDeError(login.error)}</p>}
        {lento && <p className="aviso-pixel" role="status">Despertando el servidor… la primera vez puede tardar hasta 2 minutos.</p>}
        {despedida && <p className="aviso-pixel" role="status">¡Hasta pronto! Ya puedes cerrar esta pestaña.</p>}
        <button type="submit" className="boton-tablon boton-tablon--verde" style={{ alignSelf: 'center' }} disabled={login.isPending}>
          {login.isPending ? 'ENTRANDO…' : 'COMENZAR'}
        </button>
        <div className="fila" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="enlace-pixel" onClick={() => navigate('/registro')}>CREAR CUENTA</button>
          <button type="button" className="enlace-pixel" onClick={salir}>SALIR</button>
        </div>
      </form>
      <div className="curi-login">
        <Curi animo={login.isError ? 'triste' : 'saludo_izq'} alto={120} />
      </div>
    </Escena>
  );
}
