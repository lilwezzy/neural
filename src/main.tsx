import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize analytics and session tracking
const initApp = () => {
  // Load user preferences
  const savedVolume = localStorage.getItem('neural-shift-volume');
  const savedSubliminal = localStorage.getItem('neural-shift-subliminal');
  const savedProgram = localStorage.getItem('neural-shift-last-program');
  const sessionCount = localStorage.getItem('neural-shift-session-count');

  // Set defaults if not exists
  if (savedVolume === null) localStorage.setItem('neural-shift-volume', '0.5');
  if (savedSubliminal === null) localStorage.setItem('neural-shift-subliminal', '0.05');
  if (sessionCount === null) localStorage.setItem('neural-shift-session-count', '0');

  // Track first visit
  if (!localStorage.getItem('neural-shift-first-visit')) {
    localStorage.setItem('neural-shift-first-visit', new Date().toISOString());
    console.log('Neural Shift: Welcome, first-time user!');
  } else {
    console.log('Neural Shift: Returning user');
  }

  // Log session start
  const totalSessions = parseInt(sessionCount || '0', 10) + 1;
  localStorage.setItem('neural-shift-session-count', totalSessions.toString());
  console.log(`Neural Shift: Session ${totalSessions}`);
};

initApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
