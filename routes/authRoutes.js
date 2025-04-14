const express = require('express');
const router = express.Router();

// ✅ Destructure functions from authController
const { registerUser, loginUser,changePassword,verifyOTP, resendOTP,forgotPassword, resetPassword} = require('../controllers/authController');

// ✅ Attach correct handlers to routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword); // Route to handle forgot password
router.post('/reset-password', resetPassword); // Route to handle password reset


module.exports = router;
