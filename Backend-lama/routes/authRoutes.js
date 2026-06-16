const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const { register, login, googleCallback, getProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Register
router.post('/register', [
    body('nama').notEmpty().withMessage('Nama wajib diisi'),
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
], validateRequest, register);

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('password').notEmpty().withMessage('Password wajib diisi')
], validateRequest, login);

// Google OAuth - Mulai flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

// Google OAuth - Callback
router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`
}), googleCallback);

// Get profile (protected)
router.get('/profile', requireAuth, getProfile);

module.exports = router;