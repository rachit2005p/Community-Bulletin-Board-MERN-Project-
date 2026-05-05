EMAIL VERIFICATION WITH OTP - SETUP GUIDE
==========================================

WHY EMAIL VERIFICATION WAS DISABLED:
- Server was crashing because required packages weren't installed
- Email verification requires 'nodemailer' and 'otp-generator' packages
- Need email service configuration (Gmail recommended)

HOW TO ENABLE EMAIL VERIFICATION:
=================================

1. GET GMAIL APP PASSWORD:
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Go to Security → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

2. RUN SETUP SCRIPT:
   - Double-click: setup-email-verification.bat
   - Enter your Gmail address
   - Enter your Gmail App Password
   - Script will install packages and create .env file

3. START SERVER:
   - The script will start the server automatically
   - Or run: cd backend && npm run dev

WHAT HAPPENS NOW:
================

✅ NEW USER REGISTRATION:
   - User registers → Account created (unverified)
   - OTP sent to email automatically
   - User redirected to verification page
   - Must enter OTP to activate account

✅ LOGIN PROCESS:
   - Unverified users CANNOT login
   - Get error: "Please verify your email before logging in"
   - Button to go to verification page

✅ VERIFICATION PROCESS:
   - Enter 6-digit OTP from email
   - Account activated automatically
   - User logged in immediately

EMAIL TEMPLATES:
===============

The system sends professional HTML emails with:
- Company branding
- 6-digit OTP in large, clear font
- Expiration warning (10 minutes)
- Security instructions

TROUBLESHOOTING:
================

❌ "Cannot find module 'nodemailer'"
   → Run: cd backend && npm install nodemailer otp-generator

❌ "Email not sending"
   → Check .env file has correct EMAIL_USER and EMAIL_PASS
   → Gmail: Make sure you're using App Password, not regular password

❌ "Still can login without verification"
   → Make sure server restarted after enabling verification
   → Check that .env file exists in backend/ folder

TESTING:
=======

1. Register a new account
2. Check email for OTP
3. Try to login without verification → Should fail
4. Enter OTP → Should succeed
5. Login normally → Should work

FILES MODIFIED:
==============

✅ backend/controllers/authController.js - Added OTP functions
✅ backend/routes/auth.js - Added verification routes
✅ backend/services/emailService.js - Email sending logic
✅ backend/models/mongo/User.js - Added OTP fields
✅ frontend/src/pages/EmailVerification.jsx - OTP input page
✅ frontend/src/pages/Register.jsx - Updated registration flow
✅ frontend/src/pages/Login.jsx - Added verification prompts
✅ frontend/src/App.jsx - Added verification route

CONTACT:
=======

If you need help setting up email verification,
check the EMAIL_SETUP.md file for detailed instructions!
