import './index.css';
import 'autocasting-ui-library-padimasso/dist/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppRoutes } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import { ModalProvider } from './context/ModalContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
      </ModalProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
