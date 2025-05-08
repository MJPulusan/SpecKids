import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MusicProvider } from './components/MusicContext';
import { TherapyReminderProvider } from './components/TherapyReminderProvider';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MusicProvider>
        <TherapyReminderProvider>
          <App />
        </TherapyReminderProvider>
      </MusicProvider>
    </BrowserRouter>
  </React.StrictMode>
);
