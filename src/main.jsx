import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ComplaintsProvider } from './context/ComplaintsContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ComplaintsProvider>
        <App />
      </ComplaintsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
