import './index.css';
import 'autocasting-ui-library-padimasso/dist/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppRoutes } from './routes';

import { LanguageProvider } from './context/LanguageContext';
import { ModalProvider } from './context/ModalContext';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { queryClient } from './shared/lib/queryClient';
import MetadataBootstrap from './bootstrap/MetadataBootstrap';

const persister = createAsyncStoragePersister({
  storage: window.localStorage, // o window.sessionStorage
  key: 'pm-query-cache',
  // throttleTime: 1000,          // opcional
  // serialize/deserialize: ...   // opcional (p.ej. con lz-string)
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24h
        // buster: 'app-build-hash',  // opcional para invalidar TODO en cambios mayores
      }}
    >
      <ModalProvider>
        <LanguageProvider>
          <MetadataBootstrap />
          <AppRoutes />
        </LanguageProvider>
      </ModalProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
