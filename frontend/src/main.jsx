import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CustomToastProvider } from './context/CustomToastContext.jsx';
import { SocketProvider } from './context/SocketContext'; // ✅ import

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider> {/* ✅ Wrap inside AuthProvider */}
        <CustomToastProvider> {/* ✅ Toast inside Socket to allow socket-to-toast */}
          <App />
        </CustomToastProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
);
