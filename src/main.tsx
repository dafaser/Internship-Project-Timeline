import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// PENTING: Ganti CLIENT_ID ini dengan Client ID dari Google Cloud Console Anda
// Cara mendapatkan: 
// 1. Buka console.cloud.google.com
// 2. Buat Project Baru
// 3. Masuk ke APIs & Services > Credentials
// 4. Create Credentials > OAuth Client ID > Web Application
// 5. Masukkan 'http://localhost:5173' (untuk dev) dan URL Vercel Anda di "Authorized JavaScript origins"
const GOOGLE_CLIENT_ID = "27527675780-96u0f26qm3qu9va3t0otb0n6pk4c5tj5.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);