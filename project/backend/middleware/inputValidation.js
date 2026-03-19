const { body, validationResult } = require('express-validator');

/**
 * Express-validator middleware collection.
 * handleValidationErrors must be the last item in each array.
 */

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Datos de entrada inválidos.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Login ─────────────────────────────────────────────────────────────────────
const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es requerido.')
    .isLength({ min: 3, max: 50 }).withMessage('Usuario: 3–50 caracteres.')
    .matches(/^[a-zA-Z0-9_.\-]+$/).withMessage('Usuario contiene caracteres no permitidos.'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida.')
    .isLength({ min: 8, max: 128 }).withMessage('Contraseña: 8–128 caracteres.'),
  handleValidationErrors,
];

// ── Create user ───────────────────────────────────────────────────────────────
const validateCreateUser = [
  body('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es requerido.')
    .isLength({ min: 3, max: 50 }).withMessage('Usuario: 3–50 caracteres.')
    .matches(/^[a-zA-Z0-9_.\-]+$/).withMessage('Usuario contiene caracteres no permitidos.'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida.')
    .isLength({ min: 8, max: 128 }).withMessage('Contraseña: mínimo 8 caracteres.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número.'),
  body('role')
    .optional()
    .isIn(['admin', 'superadmin']).withMessage('Rol inválido.'),
  handleValidationErrors,
];

// ── Update user ───────────────────────────────────────────────────────────────
const validateUpdateUser = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Usuario: 3–50 caracteres.')
    .matches(/^[a-zA-Z0-9_.\-]+$/).withMessage('Usuario contiene caracteres no permitidos.'),
  body('password')
    .optional()
    .isLength({ min: 8, max: 128 }).withMessage('Contraseña: mínimo 8 caracteres.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número.'),
  body('role')
    .optional()
    .isIn(['admin', 'superadmin']).withMessage('Rol inválido.'),
  body('active')
    .optional()
    .isBoolean().withMessage('active debe ser true o false.'),
  handleValidationErrors,
];

module.exports = { validateLogin, validateCreateUser, validateUpdateUser };
