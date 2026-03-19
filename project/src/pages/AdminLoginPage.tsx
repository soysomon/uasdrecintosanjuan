import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Loader2, CheckCircle2, Lock } from 'lucide-react';
import '../styles/admin.css';

/* ── Easing ─────────────────────────────────────────────── */
const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Step types ─────────────────────────────────────────── */
type Step = 'entry' | 'credentials';

/* ════════════════════════════════════════════════════════════
   AdminLoginPage — Railway-style dark minimalist, two-step
   ════════════════════════════════════════════════════════════ */
const AdminLoginPage: React.FC = () => {
  const [step, setStep]           = useState<Step>('entry');
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const shakeControls = useAnimation();

  const from = (location.state as any)?.from?.pathname || '/admin-panel';

  /* ── Open credentials panel ── */
  const handleOpenCredentials = () => {
    setError('');
    setStep('credentials');
  };

  /* ── Submit login ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      setIsSuccess(true);
      setTimeout(() => navigate(from, { replace: true }), 900);
    } catch (err: any) {
      setError(err.message || 'Usuario o contraseña incorrectos');
      shakeControls.start({
        x: [0, -9, 9, -9, 9, -4, 4, 0],
        transition: { duration: 0.48, ease: 'easeInOut' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="adm-login-root">

      {/* ── Blobs ── */}
      <div className="adm-login-blobs" aria-hidden="true">
        <div className="adm-login-blob adm-blob-1" />
        <div className="adm-login-blob adm-blob-2" />
        <div className="adm-login-blob adm-blob-3" />
      </div>

      {/* ── Card ── */}
      <motion.div
        className="adm-login-card"
        layout
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: SPRING }}
      >
        {/* Scan lines */}
        <div className="adm-login-scanlines" aria-hidden="true">
          <div className="adm-login-scanline adm-scanline-a" />
          <div className="adm-login-scanline adm-scanline-b" />
          <div className="adm-login-scanline adm-scanline-c" />
          <div className="adm-login-scanline adm-scanline-d" />
        </div>

        {/* Inner (above scan lines) */}
        <div className="adm-login-inner">
          <AnimatePresence mode="wait">

            {/* ──── SUCCESS ──── */}
            {isSuccess ? (
              <motion.div
                key="success"
                className="adm-login-success"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.48, ease: SPRING }}
              >
                <CheckCircle2 size={52} strokeWidth={1.25} />
                <p>Acceso correcto</p>
              </motion.div>

            ) : (
              <motion.div key="main" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                {/* Logo */}
                <motion.div
                  className="adm-login-logo"
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.62, delay: 0.18, ease: SPRING }}
                >
                  <img
                    src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/Logo+UASD/logo+login.png"
                    alt="UASD Recinto San Juan"
                  />
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.58, delay: 0.3, ease: SPRING }}
                >
                  <h1 className="adm-login-title">Panel Administrativo</h1>
                  <p className="adm-login-subtitle">
                    Acceso exclusivo para personal autorizado
                  </p>
                </motion.div>

                {/* ── Body: entry CTA ↔ credentials form ── */}
                <AnimatePresence mode="wait">

                  {/* STEP 1 — single CTA button */}
                  {step === 'entry' && (
                    <motion.div
                      key="entry-body"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -10 }}
                      transition={{ duration: 0.32, ease: SPRING }}
                    >
                      <motion.button
                        className="adm-login-cta"
                        onClick={handleOpenCredentials}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Lock size={15} />
                        Acceder al panel
                      </motion.button>
                    </motion.div>
                  )}

                  {/* STEP 2 — username + password + submit */}
                  {step === 'credentials' && (
                    <motion.div
                      key="creds-body"
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.42, ease: SPRING }}
                    >
                      {/* Shake wrapper */}
                      <motion.form
                        onSubmit={handleSubmit}
                        animate={shakeControls}
                      >
                        {/* Usuario */}
                        <div className="adm-login-field">
                          <label className="adm-login-label" htmlFor="adm-username">
                            Usuario
                          </label>
                          <input
                            id="adm-username"
                            className="adm-login-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Correo o nombre de usuario"
                            autoComplete="username"
                            // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus
                            required
                            disabled={isLoading}
                          />
                        </div>

                        {/* Contraseña */}
                        <div className="adm-login-field">
                          <label className="adm-login-label" htmlFor="adm-password">
                            Contraseña
                          </label>
                          <input
                            id="adm-password"
                            className="adm-login-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            disabled={isLoading}
                          />
                        </div>

                        {/* Error */}
                        <AnimatePresence initial={false}>
                          {error && (
                            <motion.p
                              className="adm-login-error"
                              key="err"
                              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              transition={{ duration: 0.22 }}
                            >
                              {error}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Submit */}
                        <button
                          type="submit"
                          className="adm-login-btn"
                          disabled={isLoading || !username.trim() || !password.trim()}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isLoading ? (
                              <motion.span
                                key="spinner"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Loader2
                                  size={16}
                                  style={{ animation: 'adm-spin 0.75s linear infinite' }}
                                />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="label"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                Iniciar sesión
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>

                      </motion.form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer */}
      <p className="adm-login-footer">
        Esta sección está reservada exclusivamente para el personal autorizado.
        Si no dispone de los permisos correspondientes, sal de esta página.
      </p>

    </div>
  );
};

export default AdminLoginPage;
