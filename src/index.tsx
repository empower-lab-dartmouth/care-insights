import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot} from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { RecoilURLSyncJSON } from 'recoil-sync';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './state/context/auth-context';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import 'react-data-grid/lib/styles.css';
import '@mantine/dates/styles.css';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <AuthProvider>
          <RecoilRoot>
          <RecoilURLSyncJSON location={{part: 'queryParams'}}>
            <App />
            </RecoilURLSyncJSON>
          </RecoilRoot>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
