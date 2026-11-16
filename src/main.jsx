import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
// HashRouter is used instead of BrowserRouter for GitHub Pages compatibility.
// GitHub Pages doesn't support server-side rewrites, so BrowserRouter causes
// blank screens on page refresh. HashRouter uses the URL hash (#) which works
// entirely client-side with no server config needed.
import App from './App';
import { ComplaintsProvider } from './context/ComplaintsContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ComplaintsProvider>
        <App />
      </ComplaintsProvider>
    </HashRouter>
  </React.StrictMode>
);
