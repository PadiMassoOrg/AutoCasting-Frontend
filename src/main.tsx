// src/main.tsx
import './index.css';
import 'autocasting-ui-library/dist/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppRoutes } from './routes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
