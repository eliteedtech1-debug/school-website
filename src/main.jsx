import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import 'flowbite';
import App from './App.jsx'
import { hideLoader } from './lib/useWebsiteContent.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
)

// Admin routes never fetch public website content, so release the loading
// screen right after first paint. Public pages keep it until the school's
// content (logo + name) resolves via brandLoader() in useWebsiteContent.
if (window.location.pathname.startsWith('/admin')) {
  requestAnimationFrame(() => requestAnimationFrame(() => hideLoader()));
} else {
  setTimeout(hideLoader, 6000); // safety net: never leave the loader stuck
}
