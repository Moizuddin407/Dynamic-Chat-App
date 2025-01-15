import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for ReactDOM
import App from './App';

const root = ReactDOM.createRoot(document.querySelector('#root')); // Use createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
