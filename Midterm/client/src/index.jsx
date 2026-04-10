import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/main.css";
import { AuthContextProvider } from './context/AuthContext';
import { BasketContextProvider } from './context/BasketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BasketContextProvider>
        <App />
      </BasketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
