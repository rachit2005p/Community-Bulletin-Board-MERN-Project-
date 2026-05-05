const mongoose = require('mongoose');


const likeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  targetId: {
    type: String,
    required: [true, 'Target ID is required'],
    index: true,
  },
  targetType: {
    type: String,
    required: [true, 'Target type is required'],
    enum: {
      values: ['post', 'comment'],
      message: 'Target type must be either post or comment'
    },
    index: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  displayName: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Compound indexes for efficient queries
likeSchema.index({ targetId: 1, targetType: 1 });
likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true }); // Prevent duplicate likes

// Static method to toggle like
likeSchema.statics.toggleLike = async function(userId, targetId, targetType, username, displayName = '') {
  const existingLike = await this.findOne({
    userId,
    targetId,
    targetType
  });

  if (existingLike) {
    // Unlike: remove the like
    await this.deleteOne({ _id: existingLike._id });
    return { action: 'unliked', like: null };
  } else {
    // Like: create new like
    const newLike = new this({
      userId,
      targetId,
      targetType,
      username,
      displayName,
    });
    await newLike.save();
    return { action: 'liked', like: newLike };
  }
};

// Static method to check if user liked target
likeSchema.statics.hasUserLiked = function(userId, targetId, targetType) {
  return this.exists({
    userId,
    targetId,
    targetType
  });
};

// Static method to get likes count for target
likeSchema.statics.getLikesCount = function(targetId, targetType) {
  return this.countDocuments({
    targetId,
    targetType
  });
};

// Static method to get likers for target
likeSchema.statics.getLikers = function(targetId, targetType, limit = 10) {
  return this.find({
    targetId,
    targetType
  })
  .select('username displayName createdAt')
  .sort({ createdAt: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Like', likeSchema);
