const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');


// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});



// Rate limiting for email verification
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 email verification requests per windowMs
  message: {
    success: false,
    message: 'Too many email verification requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 OTP verification attempts per windowMs
  message: {
    success: false,
    message: 'Too many OTP verification attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/register', authLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
router.get('/user/:userId', authController.getUserProfile);

// Email verification routes
router.post('/send-verification-otp', emailLimiter, authController.sendEmailVerificationOTP);
router.post('/verify-email-otp', otpLimiter, authController.verifyEmailOTP);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
// router.post('/upload-profile-picture', authenticateToken, upload.single('profilePicture'), authController.uploadProfilePicture);
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router;
