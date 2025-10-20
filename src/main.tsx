import 'autocasting-ui-library-padimasso/styles.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import MetadataBootstrap from './app/bootstrap/MetadataBootstrap';
import { LanguageProvider } from './app/context/LanguageContext';
import { ModalProvider } from './app/context/ModalContext';
import { AppRoutes } from './app/routes';
import { queryClient } from './app/shared/lib/queryClient';

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'pm-query-cache',
});

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24h
      }}
    >
      <MetadataBootstrap />
      <ModalProvider>
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
      </ModalProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
