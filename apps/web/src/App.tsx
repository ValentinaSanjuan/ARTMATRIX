import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useSesion } from './application/stores/sesionStore';
import { registrarSesionExpirada } from './infrastructure/api/clienteAxios';
import { InicioPage } from './presentation/pages/InicioPage';
import { LoginPage } from './presentation/pages/LoginPage';

// Las pantallas más pesadas (editor de código, teoría, perfil) se descargan solo cuando se abren.
const NivelPage = lazy(() => import('./presentation/pages/NivelPage').then((m) => ({ default: m.NivelPage })));
const PerfilPage = lazy(() => import('./presentation/pages/PerfilPage').then((m) => ({ default: m.PerfilPage })));
const TeoriaPage = lazy(() => import('./presentation/pages/TeoriaPage').then((m) => ({ default: m.TeoriaPage })));
const TutorialPage = lazy(() => import('./presentation/pages/TutorialPage').then((m) => ({ default: m.TutorialPage })));
const RegistroPage = lazy(() => import('./presentation/pages/RegistroPage').then((m) => ({ default: m.RegistroPage })));

const Cargando = () => <main className="escena escena--salon centrado"><span className="cargando">Cargando…</span></main>;

function Privada({ children }: { children: ReactNode }) {
  const sesion = useSesion((s) => s.sesion);
  return sesion ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();
  const cerrar = useSesion((s) => s.cerrar);

  useEffect(() => {
    registrarSesionExpirada(() => {
      cerrar();
      navigate('/login');
    });
  }, [cerrar, navigate]);

  return (
    <Suspense fallback={<Cargando />}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/inicio" element={<Privada><InicioPage /></Privada>} />
      <Route path="/tutorial" element={<Privada><TutorialPage /></Privada>} />
      <Route path="/teoria" element={<Privada><TeoriaPage /></Privada>} />
      <Route path="/nivel/:id" element={<Privada><NivelPage /></Privada>} />
      <Route path="/perfil" element={<Privada><PerfilPage /></Privada>} />
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
    </Suspense>
  );
}
