const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Nombre: 3–20 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email no válido'),
    body('password').isLength({ min: 6 }).withMessage('Contraseña: mínimo 6 caracteres'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
  ],
  login
);

router.get('/me', protect, getMe);

module.exports = router;
