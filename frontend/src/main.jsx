// src/main.jsx or src/index.jsx
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CustomToastProvider } from './context/CustomToastContext.jsx';
import { SocketProvider } from './context/SocketContext';

// ✅ React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configure a single QueryClient for the app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,          // cached as "fresh" for 30s
      refetchOnWindowFocus: true,    // auto-refresh when tab gains focus
      retry: 1,                      // retry once on error
    },
    mutations: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <CustomToastProvider>
            <App />
            {/* Optional Devtools (open with small button in corner) */}
            <ReactQueryDevtools initialIsOpen={false} />
          </CustomToastProvider>
        </SocketProvider>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
);
