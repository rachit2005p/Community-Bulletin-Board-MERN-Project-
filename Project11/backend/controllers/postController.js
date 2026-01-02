const { Post, ActivityLog } = require('../models/mongo');


// Get all posts with optional filtering
const getPosts = async (req, res) => {
  try {
    const {
      category,
      search,
      limit = 20,
      skip = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { status: 'active' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Add pinned posts first if not searching
    if (!search && sortBy === 'createdAt') {
      sortOptions['metadata.isPinned'] = -1;
    }

    const posts = await Post.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('author', 'username displayName');

    const total = await Post.countDocuments(query);

    // Log activity if user is authenticated
    if (req.user) {
      await ActivityLog.logActivity({
        userId: req.user.userId,
        action: 'view_post',
        resource: { type: 'system' },
        details: { category, search, count: posts.length },
      });
    }

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: total > parseInt(skip) + posts.length,
        },
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post || post.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    await Post.findByIdAndUpdate(id, {
      $inc: { 'metadata.views': 1 }
    });

    // Log activity if user is authenticated
    if (req.user) {
      await ActivityLog.logActivity({
        userId: req.user.userId,
        action: 'view_post',
        resource: { type: 'post', id: post._id },
        details: { title: post.title },
      });
    }

    res.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    console.log('Create post request received:', {
      body: req.body,
      user: req.user ? { id: req.user.id, userId: req.user.userId, username: req.user.username } : 'No user'
    });

    const {
      title,
      content,
      category,
      tags,
      location,
      contactInfo,
      images,
      expiresAt,
      priority
    } = req.body;

    console.log('Received post data:', {
      title: typeof title,
      content: typeof content,
      category: typeof category,
      tags: Array.isArray(tags) ? tags : typeof tags,
      location: typeof location,
      contactInfo: typeof contactInfo,
      images: Array.isArray(images) ? images : typeof images,
      expiresAt: typeof expiresAt,
      priority: typeof priority
    });

    console.log('User data:', {
      userId: req.user?.userId,
      username: req.user?.username,
      displayName: req.user?.displayName
    });

    // Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required and must be a non-empty string'
      });
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Content is required and must be a non-empty string'
      });
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required and must be a valid string'
      });
    }

    // Validate category is in allowed list
    const allowedCategories = ['events', 'jobs', 'alerts', 'lost-found', 'general', 'services'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: ' + allowedCategories.join(', ')
      });
    }

    // Create post
    const postData = {
      title: title.trim(),
      content: content.trim(),
      category,
      author: {
        userId: req.user.userId,
        username: req.user.username,
        displayName: req.user.displayName || req.user.username,
      },
      metadata: {},
    };

    // Set default expiration dates
    if (category === 'events' && !postData.metadata.expiresAt) {
      postData.metadata.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (category === 'jobs' && !postData.metadata.expiresAt) {
      postData.metadata.expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    }

    // Validate expiration date
    if (expiresAt && expiresAt.trim()) {
      const expirationDate = new Date(expiresAt);
      if (isNaN(expirationDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiration date format"
        });
      }
      if (expirationDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Expiration date must be in the future"
        });
      }
    }

    console.log('Creating post with data:', JSON.stringify(postData, null, 2));

    let post;
    try {
      console.log('Creating Post instance...');
      post = new Post(postData);
      console.log('Post instance created successfully');

      console.log('Validating post...');
      const validationError = post.validateSync();
      if (validationError) {
        console.error('Validation error:', validationError);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(validationError.errors).map(err => err.message)
        });
      }
      console.log('Post validation passed');

      console.log('Saving post...');
      await post.save();
      console.log('Post saved successfully');
    } catch (saveError) {
      console.error('Post save error:', saveError);
      console.error('Error name:', saveError.name);
      console.error('Error message:', saveError.message);

      if (saveError.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(saveError.errors).map(err => err.message)
        });
      }

      if (saveError.name === 'MongoError' && saveError.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Duplicate key error'
        });
      }

      throw saveError;
    }

    // Log activity (non-blocking) - temporarily disabled for debugging
    // ActivityLog.logActivity({
    //   userId: req.user.userId,
    //   action: 'create_post',
    //   resource: { type: 'post', id: post._id },
    //   details: { title: post.title, category: post.category },
    // }).catch(err => console.error('Activity logging failed:', err));

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post },
    });
  } catch (error) {
    console.error('Create post error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle other specific errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership or admin permissions
    if (post.author.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts'
      });
    }

    // Prevent updating certain fields
    delete updates._id;
    delete updates.createdAt;
    delete updates.author;
    delete updates.metadata;

    // Trim string fields
    if (updates.title) updates.title = updates.title.trim();
    if (updates.content) updates.content = updates.content.trim();
    if (updates.tags) updates.tags = updates.tags.map(tag => tag.toLowerCase().trim());

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...updates,
        'metadata.isEdited': true,
        'metadata.editedAt': new Date(),
      },
      { new: true, runValidators: true }
    );

    // Log activity
    await ActivityLog.logActivity({
      userId: req.user.userId,
      action: 'update_post',
      resource: { type: 'post', id: post._id },
      details: { title: post.title, changes: Object.keys(updates) },
    });

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post: updatedPost },
    });
  } catch (error) {
    console.error('Update post error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership or admin permissions
    if (post.author.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    // Soft delete - change status to 'deleted'
    await Post.findByIdAndUpdate(id, { status: 'deleted' });

    // Log activity
    await ActivityLog.logActivity({
      userId: req.user.userId,
      action: 'delete_post',
      resource: { type: 'post', id: post._id },
      details: { title: post.title },
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get posts by user
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    // Allow users to view their own posts or admins to view any posts
    if (userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own posts'
      });
    }

    const posts = await Post.find({
      'author.userId': userId,
      status: { $in: ['active', 'archived'] }
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Post.countDocuments({
      'author.userId': userId,
      status: { $in: ['active', 'archived'] }
    });

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: total > parseInt(skip) + posts.length,
        },
      },
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get post categories and stats
const getCategories = async (req, res) => {
  try {
    const categories = await Post.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          lastPost: { $max: '$createdAt' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const categoryStats = {};
    categories.forEach(cat => {
      categoryStats[cat._id] = {
        count: cat.count,
        lastPost: cat.lastPost
      };
    });

    res.json({
      success: true,
      data: {
        categories: categoryStats,
        availableCategories: [
          'events', 'jobs', 'alerts', 'lost-found', 'general', 'services'
        ]
      },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getCategories,
};
