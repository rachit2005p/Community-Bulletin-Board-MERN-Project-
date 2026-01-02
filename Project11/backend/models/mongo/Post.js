const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxLength: [10000, 'Content cannot exceed 10,000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['events', 'jobs', 'alerts', 'lost-found', 'general', 'services'],
      message: 'Category must be one of: events, jobs, alerts, lost-found, general, services'
    },
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
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxLength: 50,
  }],
  images: [{
    url: {
      type: String,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  location: {
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  contactInfo: {
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  // Event-specific fields (only used when category is 'events')
  eventDetails: {
    eventDate: {
      type: Date,
    },
    eventEndDate: {
      type: Date,
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
    maxAttendees: {
      type: Number,
      min: 1,
    },
    rsvpCount: {
      type: Number,
      default: 0,
    },
  },
  metadata: {
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    expiresAt: {
      type: Date,
    },
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active',
    index: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
postSchema.index({ 'author.userId': 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'metadata.isPinned': -1, createdAt: -1 });
postSchema.index({ 'metadata.expiresAt': 1 });
postSchema.index({ status: 1, createdAt: -1 });

// Virtual for checking if post is expired
postSchema.virtual('isExpired').get(function() {
  return this.metadata.expiresAt && new Date() > this.metadata.expiresAt;
});

// Removed pre-save middleware - expiration dates are now set in controller


// Static method to get posts by category
postSchema.statics.getByCategory = function(category, limit = 20, skip = 0) {
  return this.find({ category, status: 'active' })
    .sort({ 'metadata.isPinned': -1, createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to search posts
postSchema.statics.search = function(query, category = null) {
  const searchQuery = {
    status: 'active',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
    ],
  };

  if (category) {
    searchQuery.category = category;
  }

  return this.find(searchQuery)
    .sort({ createdAt: -1 })
    .limit(50);
};

module.exports = mongoose.model('Post', postSchema);
