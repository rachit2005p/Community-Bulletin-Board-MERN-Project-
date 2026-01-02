const bcrypt = require('bcryptjs');
const { User } = require('../models/mongo');
const { generateToken, generateRefreshToken } = require('../middleware/auth');
const { ActivityLog } = require('../models/mongo');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if user already exists
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    const existingEmail = await User.findOne({ email: email.toLowerCase() });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      role: 'user', // Default role
    });

    // Generate OTP for email verification
    // const otp = generateOTP();
    // user.emailVerificationOTP = otp;
    // user.emailVerificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // Send verification email
    // try {
    //   await sendEmailVerificationOTP(user.email, otp);
    // } catch (emailError) {
    //   console.error('Failed to send verification email:', emailError);
    //   // Don't fail registration if email fails, but log it
    // }

    // Log activity
    await ActivityLog.logActivity({
      userId: user._id.toString(),
      action: 'register',
      resource: { type: 'user', id: user._id },
      details: { username: user.username, email: user.email },
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Log activity
    await ActivityLog.logActivity({
      userId: user._id.toString(),
      action: 'register',
      resource: { type: 'user', id: user._id },
      details: { username: user.username, email: user.email },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          displayName: user.displayName,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          profile: user.profile,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check if username looks like an email and validate format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (username.includes('@')) {
      if (!emailRegex.test(username)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
    }

    // Find user
    const user = await User.findByUsernameOrEmail(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if email is verified
    // if (!user.emailVerified) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Please verify your email before logging in',
    //     requiresEmailVerification: true,
    //     email: user.email
    //   });
    // }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Log activity
    await ActivityLog.logActivity({
      userId: user._id.toString(),
      action: 'login',
      resource: { type: 'user', id: user._id },
      details: { username: user.username },
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          displayName: user.displayName,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          profile: user.profile,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          displayName: user.displayName,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          profile: user.profile,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== req.user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    // Update user
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName?.trim();
    if (lastName !== undefined) updateData.lastName = lastName?.trim();
    if (email !== undefined) updateData.email = email.toLowerCase();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log activity
    await ActivityLog.logActivity({
      userId: userId.toString(),
      action: 'update_profile',
      resource: { type: 'user', id: userId },
      details: { fields: Object.keys(updateData) },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          displayName: updatedUser.displayName,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user profile by ID or username
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    let user;

    // Try to find by ID first, then by username
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      // Looks like MongoDB ObjectId
      user = await User.findById(userId);
    }

    if (!user) {
      // Try finding by username
      user = await User.findOne({ username: userId.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's posts count
    const { Post } = require('../models/mongo');
    const postsCount = await Post.countDocuments({
      'author.userId': user._id.toString(),
      status: 'active'
    });

    // Get user's comments count (if Comment model exists)
    let commentsCount = 0;
    try {
      const { Comment } = require('../models/mongo');
      commentsCount = await Comment.countDocuments({
        authorId: user._id.toString()
      });
    } catch (error) {
      // Comment model might not exist yet, that's ok
    }

    // Update user's stats
    user.reputation.stats.postsCount = postsCount;
    user.reputation.stats.commentsCount = commentsCount;
    await user.save();

    const userProfile = {
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      profile: user.profile,
      reputation: user.reputation,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isOnline: user.lastLogin && (Date.now() - new Date(user.lastLogin).getTime()) < 300000, // 5 minutes
    };

    res.json({
      success: true,
      data: {
        user: userProfile
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.checkPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log activity
    await ActivityLog.logActivity({
      userId: userId.toString(),
      action: 'change_password',
      resource: { type: 'user', id: userId },
      details: {},
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    console.log('Upload profile picture request received');
    console.log('File:', req.file);
    console.log('User:', req.user);

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user.userId;
    const profilePicturePath = `/uploads/${req.file.filename}`;

    // Update user's profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 'profile.avatar': profilePicturePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log activity
    await ActivityLog.logActivity({
      userId: userId.toString(),
      action: 'update_profile_picture',
      resource: { type: 'user', id: userId },
      details: { avatar: profilePicturePath },
    });

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        user: {
          userId: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          displayName: updatedUser.displayName,
          profile: updatedUser.profile,
        },
        profilePicture: profilePicturePath
      },
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);

    // Clean up uploaded file if error occurs
    if (req.file && req.file.path) {
      const fs = require('fs');
      const path = require('path');
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    if (error.message === 'Only image files are allowed!') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send email verification OTP
const sendEmailVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists and is not already verified
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Set OTP and expiration (10 minutes from now)
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP email
    await sendEmailVerificationOTP(email, otp);

    // Log activity
    await ActivityLog.logActivity({
      userId: user._id.toString(),
      action: 'send_verification_otp',
      resource: { type: 'user', id: user._id },
      details: { email: user.email },
    });

    res.json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('Send email verification OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code. Please try again.'
    });
  }
};

// Verify email with OTP
const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check if OTP exists and is not expired
    if (!user.emailVerificationOTP || !user.emailVerificationOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please request a new one.'
      });
    }

    // Check if OTP is expired
    if (new Date() > user.emailVerificationOTPExpires) {
      // Clear expired OTP
      user.emailVerificationOTP = undefined;
      user.emailVerificationOTPExpires = undefined;
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    // Check if OTP matches
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpires = undefined;
    await user.save();

    // Generate tokens for automatic login after verification
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Log activity
    await ActivityLog.logActivity({
      userId: user._id.toString(),
      action: 'verify_email',
      resource: { type: 'user', id: user._id },
      details: { email: user.email },
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          profile: user.profile,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Verify email OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email. Please try again.'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
  sendEmailVerificationOTP,
  verifyEmailOTP,
};
