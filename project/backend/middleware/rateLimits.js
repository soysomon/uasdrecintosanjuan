const rateLimit = require('express-rate-limit');

/**
 * Centralized rate limiting configuration.
 *
 * loginLimiter   → /api/auth/login  — tight window, only counts failures
 * authLimiter    → all /api/auth/*  — medium window
 * uploadLimiter  → upload endpoints — hourly cap
 * apiLimiter     → general API      — generous but bounded
 */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  skipSuccessfulRequests: true, // Only count failed attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de inicio de sesión. Intente en 15 minutos.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes de autenticación. Intente más tarde.' },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Límite de subidas alcanzado. Intente en 1 hora.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes. Intente más tarde.' },
});

module.exports = { loginLimiter, authLimiter, uploadLimiter, apiLimiter };
