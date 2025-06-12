
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './../src/styles/index.css';
import App from './pages/App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

