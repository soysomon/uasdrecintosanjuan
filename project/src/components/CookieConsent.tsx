// src/components/CookieConsent.tsx
// Cookie consent banner — Harvard University design philosophy.
// Vanilla behavior: pure CSS transition, localStorage, Escape key. Zero libs.
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'uasd_cookie_consent';

// Inject DM Sans once (self-contained, no global config needed)
function loadDMSans() {
  if (document.getElementById('dm-sans-font')) return;
  const link = document.createElement('link');
  link.id = 'dm-sans-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap';
  document.head.appendChild(link);
}

const CookieConsent: React.FC = () => {
  const [mounted, setMounted]   = useState(false);
  const [visible, setVisible]   = useState(false);

  // Load font + decide whether to show
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return; // already decided
    loadDMSans();

    const timer = setTimeout(() => {
      setMounted(true);
      // One extra rAF to trigger the CSS transition after mount
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Escape key
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss('essential');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted]);

  const dismiss = (choice: 'essential' | 'all') => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
    // Unmount after slide-down completes
    setTimeout(() => setMounted(false), 700);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Scoped styles — no external CSS needed */}
      <style>{`
        .cc-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #444;
          background: none;
          border: none;
          border-bottom: 1px solid transparent;
          padding: 2px 0;
          cursor: pointer;
          line-height: 1.5;
          letter-spacing: 0.01em;
          transition: border-color 0.15s ease;
        }
        .cc-btn:hover {
          border-bottom-color: #444;
        }
        .cc-btn:focus-visible {
          outline: 2px solid #444;
          outline-offset: 3px;
          border-radius: 1px;
        }
      `}</style>

      <div
        role="dialog"
        aria-live="polite"
        aria-label="Preferencias de cookies"
        style={{
          position:        'fixed',
          bottom:          0,
          left:            0,
          right:           0,
          zIndex:          9999,
          backgroundColor: '#faf9f7',
          borderTop:       '1px solid #1a1a1a',
          transform:       visible ? 'translateY(0)' : 'translateY(100%)',
          transition:      'transform 0.65s cubic-bezier(0.19, 1, 0.22, 1)',
          willChange:      'transform',
        }}
      >
        <div
          style={{
            maxWidth:       '1280px',
            margin:         '0 auto',
            padding:        '16px 24px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            gap:            '24px',
            flexWrap:       'wrap',
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   '13px',
              color:      '#444',
              lineHeight: '1.6',
              margin:     0,
              flex:       '1 1 260px',
            }}
          >
            Usamos cookies para analizar el tráfico. No compartimos datos personales.
          </p>

          <div style={{ display: 'flex', gap: '28px', flexShrink: 0 }}>
            <button className="cc-btn" onClick={() => dismiss('essential')}>
              Solo esenciales
            </button>
            <button className="cc-btn" onClick={() => dismiss('all')}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
