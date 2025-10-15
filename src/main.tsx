import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// =====================
// Google Analytics 4
// =====================
(function() {
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-MF1GH610V8';
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MF1GH610V8');
  `;
  document.head.appendChild(script2);
})();

// =====================
// Renderiza o app React
// =====================
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
