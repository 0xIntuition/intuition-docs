import { createRoot } from 'react-dom/client';
import { App } from './app.tsx';

// #region mount
const host = document.getElementById('root');
if (!host) throw new Error('Add an element with id="root" to the host page.');
createRoot(host).render(<App />);
// #endregion
