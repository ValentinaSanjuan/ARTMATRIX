import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useSesion } from './application/stores/sesionStore';
import { registrarSesionExpirada } from './infrastructure/api/clienteAxios';
import { InicioPage } from './presentation/pages/InicioPage';
import { LoginPage } from './presentation/pages/LoginPage';
import { NivelPage } from './presentation/pages/NivelPage';
import { PerfilPage } from './presentation/pages/PerfilPage';
import { RegistroPage } from './presentation/pages/RegistroPage';
import { TeoriaPage } from './presentation/pages/TeoriaPage';
import { TutorialPage } from './presentation/pages/TutorialPage';

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
  );
}
