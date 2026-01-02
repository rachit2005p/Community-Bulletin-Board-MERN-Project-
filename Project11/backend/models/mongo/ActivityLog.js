const mongoose = require('mongoose');


const activityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: {
      values: [
        'login', 'logout', 'register',
        'create_post', 'update_post', 'delete_post', 'view_post',
        'create_comment', 'update_comment', 'delete_comment',
        'like_post', 'unlike_post', 'like_comment', 'unlike_comment',
        'update_profile', 'change_password',
        'admin_action'
      ],
      message: 'Invalid action type'
    },
  },
  resource: {
    type: {
      type: String,
      enum: ['post', 'comment', 'user', 'system'],
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Not all actions have a resource ID
    },
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Flexible object for action-specific data
    default: {},
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    sessionId: String,
    location: {
      country: String,
      city: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: false, // We use custom timestamp field
});

// Indexes for efficient querying
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ 'resource.type': 1, 'resource.id': 1 });
activityLogSchema.index({ timestamp: -1 }); // For time-based queries

// Static method to log user activity
activityLogSchema.statics.logActivity = async function(data) {
  try {
    const logEntry = new this(data);
    await logEntry.save();
    return logEntry;
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error - logging should not break the main flow
    return null;
  }
};

// Static method to get user activity history
activityLogSchema.statics.getUserActivity = function(userId, limit = 50, skip = 0) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get recent activities for admin dashboard
activityLogSchema.statics.getRecentActivities = function(limit = 100) {
  return this.find({})
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'username'); // Note: This won't work with PostgreSQL ID
};

// Instance method to get formatted activity description
activityLogSchema.methods.getDescription = function() {
  const actionDescriptions = {
    login: 'logged in',
    logout: 'logged out',
    register: 'registered an account',
    create_post: 'created a new post',
    update_post: 'updated a post',
    delete_post: 'deleted a post',
    view_post: 'viewed a post',
    create_comment: 'added a comment',
    update_comment: 'edited a comment',
    delete_comment: 'deleted a comment',
    like_post: 'liked a post',
    unlike_post: 'unliked a post',
    like_comment: 'liked a comment',
    unlike_comment: 'unliked a comment',
    update_profile: 'updated their profile',
    change_password: 'changed their password',
    admin_action: 'performed an admin action',
  };

  return actionDescriptions[this.action] || 'performed an action';
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
