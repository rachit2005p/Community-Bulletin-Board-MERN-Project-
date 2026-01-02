const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');



// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};


const sendEmailVerificationOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Community Bulletin Board'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - Community Bulletin Board',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-code { background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { color: #d9534f; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Community Bulletin Board!</h1>
              <p>Please verify your email address</p>
            </div>
            <div class="content">
              <h2>Email Verification Required</h2>
              <p>Thank you for registering with Community Bulletin Board. To complete your registration and start connecting with your community, please verify your email address.</p>

              <p><strong>Your verification code is:</strong></p>
              <div class="otp-code">${otp}</div>

              <p><strong>Important:</strong></p>
              <ul>
                <li>This code will expire in <strong>10 minutes</strong></li>
                <li>Enter this code on the verification page</li>
                <li>Do not share this code with anyone</li>
              </ul>

              <p>If you didn't create an account, please ignore this email.</p>

              <div class="footer">
                <p>Best regards,<br>The Community Bulletin Board Team</p>
                <p class="warning">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Community Bulletin Board!

Your email verification code is: ${otp}

This code will expire in 10 minutes. Please enter it on the verification page to complete your registration.

If you didn't create an account, please ignore this email.

Best regards,
The Community Bulletin Board Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};


const sendPasswordResetOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Community Bulletin Board'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - Community Bulletin Board',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-code { background: #fff; border: 2px solid #e74c3c; border-radius: 8px; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #e74c3c; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { color: #d9534f; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
              <p>Secure your account</p>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password for your Community Bulletin Board account.</p>

              <p><strong>Your reset code is:</strong></p>
              <div class="otp-code">${otp}</div>

              <p><strong>Important:</strong></p>
              <ul>
                <li>This code will expire in <strong>10 minutes</strong></li>
                <li>Use this code to reset your password</li>
                <li>Do not share this code with anyone</li>
              </ul>

              <p>If you didn't request a password reset, please ignore this email. Your account remains secure.</p>

              <div class="footer">
                <p>Best regards,<br>The Community Bulletin Board Team</p>
                <p class="warning">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Password Reset Request - Community Bulletin Board

Your password reset code is: ${otp}

This code will expire in 10 minutes. Use this code to reset your password.

If you didn't request a password reset, please ignore this email.

Best regards,
The Community Bulletin Board Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  generateOTP,
  sendEmailVerificationOTP,
  sendPasswordResetOTP,
};
