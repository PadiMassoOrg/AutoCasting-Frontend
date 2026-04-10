import 'autocasting-ui-library-padimasso/styles.css';
import 'react-day-picker/style.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import MetadataBootstrap from './app/bootstrap/MetadataBootstrap';
import { LanguageProvider } from './app/context/LanguageContext';
import { ModalProvider } from './app/context/ModalContext';
import { ToastProvider } from './app/context/ToastContext';
import { UserModeProvider } from './app/context/UserModeContext';
import { AppRoutes } from './app/routes';
import { queryClient } from './app/shared/lib/queryClient';

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'pm-query-cache',
  throttleTime: 1500, // ayuda a evitar snapshots “intermedios”
});

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const BUSTER = import.meta.env.VITE_APP_VERSION ?? 'dev'; // o el hash del build

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24h
        buster: BUSTER,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const q = query as any;

            // 1) NO persistir si hay una promise asociada (in-flight/cancelable)
            if (q?.promise) return false;

            // 2) Persistir solo success + idle (sin background refetch)
            return query.state.status === 'success' && query.state.fetchStatus === 'idle';
          },
        },
      }}
    >
      <MetadataBootstrap />
      <UserModeProvider>
        <ToastProvider>
          <ModalProvider>
            <LanguageProvider>
              <AppRoutes />
            </LanguageProvider>
          </ModalProvider>
        </ToastProvider>
      </UserModeProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
