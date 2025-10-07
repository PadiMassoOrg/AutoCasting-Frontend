// main.tsx
import 'autocasting-ui-library-padimasso/styles.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppRoutes } from './routes';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import MetadataBootstrap from './bootstrap/MetadataBootstrap';
import { LanguageProvider } from './context/LanguageContext';
import { ModalProvider } from './context/ModalContext';
import { TALENT_DATABASE_CACHE_KEY } from './features/talent-database/services/talentDatabaseService';
import { queryClient } from './shared/lib/queryClient';

const PERSIST_KEY = 'pm-query-cache';
const safeLocalStoragePersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(client));
    } catch {
      // Si falla (quota/private mode), ignora
    }
  },
  restoreClient: async (): Promise<PersistedClient | undefined> => {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (!raw) return undefined;
      return JSON.parse(raw);
    } catch {
      try {
        localStorage.removeItem(PERSIST_KEY);
      } catch {}
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      localStorage.removeItem(PERSIST_KEY);
    } catch {}
  },
};

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: safeLocalStoragePersister,
        maxAge: 24 * 60 * 60 * 1000, // 24h
        dehydrateOptions: {
          // No persistimos NUNCA el catálogo
          shouldDehydrateQuery: (q) => {
            const key0 = Array.isArray(q.queryKey) ? q.queryKey[0] : undefined;
            return key0 !== TALENT_DATABASE_CACHE_KEY;
          },
        },
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
