import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { env } from './infrastructure/config/env';
import './presentation/styles/pixel.css';

// El backend gratuito de Render se duerme: se le avisa apenas carga la página para que
// vaya despertando mientras el estudiante escribe su usuario y contraseña.
fetch(`${env.apiUrl}/actuator/health`, { cache: 'no-store' }).catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
