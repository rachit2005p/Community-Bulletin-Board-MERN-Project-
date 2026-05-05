const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post ID is required'],
    index: true,
  },
  author: {
    // Reference to PostgreSQL User ID
    userId: {
      type: String,
      required: [true, 'Author userId is required'],
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Author username is required'],
    },
    displayName: {
      type: String,
      default: '',
    },
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxLength: [2000, 'Comment cannot exceed 2,000 characters'],
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
    index: true,
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  metadata: {
    likes: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active',
    index: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ parentCommentId: 1, createdAt: 1 });
commentSchema.index({ 'author.userId': 1, createdAt: -1 });

// Virtual for depth level (how nested the comment is)
commentSchema.virtual('depth').get(function() {
  return this.parentCommentId ? 1 : 0; // Simplified - could be calculated recursively
});

// Pre-save middleware to update parent comment's replies array
commentSchema.pre('save', async function(next) {
  if (this.isNew && this.parentCommentId) {
    try {
      await mongoose.model('Comment').findByIdAndUpdate(
        this.parentCommentId,
        { $push: { replies: this._id } }
      );
    } catch (error) {
      console.error('Error updating parent comment replies:', error);
    }
  }
  next();
});

// Pre-remove middleware to clean up replies and parent references
commentSchema.pre('remove', async function(next) {
  try {
    // Remove all replies
    if (this.replies && this.replies.length > 0) {
      await mongoose.model('Comment').deleteMany({ _id: { $in: this.replies } });
    }

    // Remove this comment from parent's replies array
    if (this.parentCommentId) {
      await mongoose.model('Comment').findByIdAndUpdate(
        this.parentCommentId,
        { $pull: { replies: this._id } }
      );
    }
  } catch (error) {
    console.error('Error cleaning up comment references:', error);
  }
  next();
});

// Static method to get comments for a post (with replies)
commentSchema.statics.getCommentsForPost = async function(postId, limit = 50) {
  const comments = await this.find({
    postId,
    parentCommentId: null,
    status: 'active'
  })
  .sort({ createdAt: 1 })
  .limit(limit)
  .populate({
    path: 'replies',
    match: { status: 'active' },
    options: { sort: { createdAt: 1 } }
  });

  return comments;
};

// Static method to get comment thread (comment + all replies)
commentSchema.statics.getCommentThread = async function(commentId) {
  const comment = await this.findById(commentId)
    .populate({
      path: 'replies',
      match: { status: 'active' },
      options: { sort: { createdAt: 1 } },
      populate: {
        path: 'replies',
        match: { status: 'active' },
        options: { sort: { createdAt: 1 } }
      }
    });

  return comment;
};

module.exports = mongoose.model('Comment', commentSchema);
