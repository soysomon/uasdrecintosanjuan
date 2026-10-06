import React, { useEffect, useRef, useState } from 'react';

interface SessionExpiredDialogProps {
  expired: boolean;
  open: boolean;
  username: string;
  onReauthenticate: (password: string) => Promise<void>;
  onDismiss: () => void;
  onReopen: () => void;
}

// Un nivel por encima de la capa superior existente (nav pública, CookieConsent y react-hot-toast en 9999)
// y por debajo del skip-link (10001).
const Z_SESSION = 10000;

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]):not([readonly])';

const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({
  expired,
  open,
  username,
  onReauthenticate,
  onDismiss,
  onReopen,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setPassword('');
    setError('');
    passwordRef.current?.focus();
    return () => {
      const target = returnFocusRef.current;
      if (target && document.contains(target)) target.focus();
    };
  }, [open]);

  // Tras un error el campo ya está habilitado de nuevo; enfocarlo antes lo dejaría sin foco.
  useEffect(() => {
    if (error) passwordRef.current?.focus();
  }, [error]);

  if (!expired) return null;

  if (!open) {
    return (
      <div
        role="status"
        style={{
          position: 'fixed',
          top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: Z_SESSION,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 8px 8px 16px',
          background: '#ffffff',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid #a31f34',
          borderRadius: 8,
          boxShadow: 'var(--shadow-medium)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 14,
          color: 'var(--color-text-primary)',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <span>Sesión expirada. Tus cambios siguen en pantalla.</span>
        <button type="button" onClick={onReopen} style={primaryButton}>
          Iniciar sesión
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!password || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await onReauthenticate(password);
    } catch (err: any) {
      setPassword('');
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !submitting) {
      e.stopPropagation();
      onDismiss();
      return;
    }
    if (e.key !== 'Tab' || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: Z_SESSION,
        background: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        aria-describedby="session-expired-desc"
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: 'var(--shadow-elevated)',
          padding: 24,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: 'var(--color-text-primary)',
        }}
      >
        <h2
          id="session-expired-title"
          style={{ fontFamily: 'inherit', fontSize: 18, fontWeight: 600, lineHeight: 1.3, margin: '0 0 8px' }}
        >
          Tu sesión expiró
        </h2>
        <div id="session-expired-desc" style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>
          <p style={{ margin: '0 0 8px', color: 'var(--color-text-primary)' }}>
            Tu sesión expiró. Inicia sesión nuevamente para continuar.
          </p>
          <p style={{ margin: 0 }}>
            Lo que escribiste sigue en pantalla. No recargues la página. Después de iniciar sesión,
            vuelve a pulsar Guardar.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 20, display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="session-reauth-username" style={labelStyle}>Usuario</label>
            <input
              id="session-reauth-username"
              type="text"
              value={username}
              readOnly
              autoComplete="username"
              style={{ ...inputStyle, background: 'var(--color-surface-alt)', color: 'var(--color-text-secondary)' }}
            />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="session-reauth-password" style={labelStyle}>Contraseña</label>
            <input
              id="session-reauth-password"
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'session-reauth-error' : undefined}
              disabled={submitting}
              style={inputStyle}
            />
          </div>

          {error && (
            <p id="session-reauth-error" role="alert" style={{ margin: 0, fontSize: 14, color: '#a31f34' }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: 4 }}>
            <button type="button" onClick={onDismiss} disabled={submitting} style={secondaryButton}>
              Cerrar
            </button>
            <button
              type="submit"
              disabled={submitting || !password}
              style={{ ...primaryButton, opacity: submitting || !password ? 0.6 : 1 }}
            >
              {submitting ? 'Verificando…' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text-primary)',
};

const inputStyle: React.CSSProperties = {
  minHeight: 44,
  padding: '10px 12px',
  fontSize: 16,
  fontFamily: 'inherit',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  color: 'var(--color-text-primary)',
  background: '#ffffff',
};

const baseButton: React.CSSProperties = {
  minHeight: 44,
  padding: '0 18px',
  fontSize: 15,
  fontWeight: 600,
  fontFamily: 'inherit',
  borderRadius: 8,
  cursor: 'pointer',
};

const primaryButton: React.CSSProperties = {
  ...baseButton,
  background: 'var(--color-primary)',
  color: '#ffffff',
  border: '1px solid var(--color-primary)',
};

const secondaryButton: React.CSSProperties = {
  ...baseButton,
  background: '#ffffff',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border)',
};

export default SessionExpiredDialog;
