import CssBaseline from '@mui/material/CssBaseline';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import App from './App';
import { initAuthPersistence } from './firebase/initAuth';
import { store } from './store';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});

Sentry.captureMessage('App started', { level: 'info' });

initAuthPersistence().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <CssBaseline />
          <App />
        </Provider>
      </BrowserRouter>
    </StrictMode>
  );
});
