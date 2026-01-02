const { Comment, Post, ActivityLog } = require('../models/mongo');


// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { limit = 50 } = req.query;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post || post.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comments = await Comment.getCommentsForPost(postId, parseInt(limit));

    res.json({
      success: true,
      data: { comments },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new comment
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    // Validation
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post || post.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // If replying to a comment, verify parent exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment || parentComment.status !== 'active') {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    // Create comment
    const comment = new Comment({
      postId,
      content: content.trim(),
      author: {
        userId: req.user.userId,
        username: req.user.username,
        displayName: req.user.displayName,
      },
      parentCommentId: parentCommentId || null,
    });

    await comment.save();

    // Update post comment count
    await Post.findByIdAndUpdate(postId, {
      $inc: { 'metadata.commentsCount': 1 }
    });

    // Populate the saved comment
    await comment.populate('replies');

    // Log activity
    await ActivityLog.logActivity({
      userId: req.user.userId,
      action: 'create_comment',
      resource: { type: 'comment', id: comment._id },
      details: {
        postId,
        postTitle: post.title,
        isReply: !!parentCommentId
      },
    });

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: { comment },
    });
  } catch (error) {
    console.error('Create comment error:', error);
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

// Update comment
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    // Validation
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.author.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    // Update comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content: content.trim(),
        'metadata.isEdited': true,
        'metadata.editedAt': new Date(),
      },
      { new: true, runValidators: true }
    );

    // Log activity
    await ActivityLog.logActivity({
      userId: req.user.userId,
      action: 'update_comment',
      resource: { type: 'comment', id: comment._id },
      details: { postId: comment.postId },
    });

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment: updatedComment },
    });
  } catch (error) {
    console.error('Update comment error:', error);
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

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership or admin permissions
    if (comment.author.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    // Soft delete
    await Comment.findByIdAndUpdate(commentId, { status: 'deleted' });

    // Update post comment count
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { 'metadata.commentsCount': -1 }
    });

    // Log activity
    await ActivityLog.logActivity({
      userId: req.user.userId,
      action: 'delete_comment',
      resource: { type: 'comment', id: comment._id },
      details: { postId: comment.postId },
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Like/unlike comment
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment || comment.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // For simplicity, just increment like count
    // In a real app, you'd track individual user likes
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { 'metadata.likes': 1 } },
      { new: true }
    );

    // Log activity
    await ActivityLog.logActivity({
      userId: req.user.userId,
      action: 'like_comment',
      resource: { type: 'comment', id: comment._id },
      details: { postId: comment.postId },
    });

    res.json({
      success: true,
      message: 'Comment liked',
      data: { comment: updatedComment },
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get comment thread (comment with all replies)
const getCommentThread = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.getCommentThread(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      data: { comment },
    });
  } catch (error) {
    console.error('Get comment thread error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getCommentThread,
};
