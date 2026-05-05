const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minLength: [3, 'Username must be at least 3 characters'],
    maxLength: [50, 'Username cannot exceed 50 characters'],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
  },
  firstName: {
    type: String,
    trim: true,
    maxLength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: [50, 'Last name cannot exceed 50 characters'],
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be either user or admin'
    },
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  profile: {
    avatar: String,
    bio: {
      type: String,
      maxLength: [500, 'Bio cannot exceed 500 characters'],
    },
    location: String,
    website: String,
  },
  reputation: {
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: String,
      enum: ['Newbie', 'Contributor', 'Trusted', 'Expert', 'Moderator'],
      default: 'Newbie',
    },
    badges: [{
      type: {
        type: String,
        enum: ['First Post', 'Helpful', 'Popular', 'Community Champion', 'Early Adopter'],
      },
      earnedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    stats: {
      postsCount: {
        type: Number,
        default: 0,
      },
      commentsCount: {
        type: Number,
        default: 0,
      },
      likesReceived: {
        type: Number,
        default: 0,
      },
      likesGiven: {
        type: Number,
        default: 0,
      },
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationOTP: String,
  emailVerificationOTPExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'reputation.points': -1 });
userSchema.index({ 'reputation.level': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.username;
});

userSchema.virtual('displayName').get(function() {
  return this.fullName;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Instance method to check password
userSchema.methods.checkPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    displayName: this.displayName,
    role: this.role,
    profile: this.profile,
    reputation: this.reputation,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

// Instance method to update reputation level based on points
userSchema.methods.updateReputationLevel = function() {
  const points = this.reputation.points;

  if (points >= 1000) {
    this.reputation.level = 'Moderator';
  } else if (points >= 500) {
    this.reputation.level = 'Expert';
  } else if (points >= 200) {
    this.reputation.level = 'Trusted';
  } else if (points >= 50) {
    this.reputation.level = 'Contributor';
  } else {
    this.reputation.level = 'Newbie';
  }

  return this.save();
};

// Instance method to add reputation points
userSchema.methods.addReputationPoints = function(points, reason = '') {
  this.reputation.points += points;

  // Add badges based on achievements
  if (this.reputation.stats.postsCount === 1 && points === 10) {
    this.reputation.badges.push({ type: 'First Post' });
  }

  if (this.reputation.stats.likesReceived >= 10 && !this.reputation.badges.some(b => b.type === 'Popular')) {
    this.reputation.badges.push({ type: 'Popular' });
  }

  return this.updateReputationLevel();
};

// Instance method to update stats
userSchema.methods.updateStats = function(statType, increment = 1) {
  if (this.reputation.stats[statType] !== undefined) {
    this.reputation.stats[statType] += increment;
  }
  return this.save();
};

// Static method to find user by username or email
userSchema.statics.findByUsernameOrEmail = function(identifier) {
  return this.findOne({
    $or: [
      { username: identifier.toLowerCase() },
      { email: identifier.toLowerCase() }
    ]
  });
};

// Transform function to remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
