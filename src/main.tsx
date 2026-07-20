// Prevent "Cannot set property fetch of #<Window> which has only a getter" errors in iframe sandbox
try {
  const originalFetch = window.fetch;
  let customFetch = originalFetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return customFetch;
    },
    set(value) {
      customFetch = value;
    },
    configurable: true,
    enumerable: true
  });
} catch (e) {
  console.warn("Unable to define window.fetch setter wrapper in main.tsx:", e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
