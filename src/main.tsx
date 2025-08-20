import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import './index.css';
import App from './App';
import { initAuthPersistence } from './firebase/initAuth';

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
