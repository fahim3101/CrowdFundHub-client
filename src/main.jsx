import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import './index.css';
import router from './routes/Router';
import AuthProvider from './contexts/AuthContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' } }} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
