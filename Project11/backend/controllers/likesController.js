const { Like, Post, Comment, User } = require('../models/mongo');
const { ActivityLog } = require('../models/mongo');


// Toggle like on post or comment
const toggleLike = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    const userId = req.user.id;
    const { username, displayName } = req.user;

    // Validate target type
    if (!['post', 'comment'].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type. Must be "post" or "comment"'
      });
    }

    // Check if target exists
    let targetExists = false;
    if (targetType === 'post') {
      targetExists = await Post.exists({ _id: targetId, status: 'active' });
    } else {
      targetExists = await Comment.exists({ _id: targetId });
    }

    if (!targetExists) {
      return res.status(404).json({
        success: false,
        message: `${targetType} not found`
      });
    }

    // Toggle the like
    const result = await Like.toggleLike(userId, targetId, targetType, username, displayName || '');

    // Update the target's like count
    let newLikeCount = 0;
    if (targetType === 'post') {
      newLikeCount = await Like.getLikesCount(targetId, targetType);
      await Post.findByIdAndUpdate(targetId, { 'metadata.likes': newLikeCount });

      // Update user reputation if it's a post like
      if (result.action === 'liked') {
        // Find post author and give them reputation points
        const post = await Post.findById(targetId);
        if (post && post.author.userId !== userId) { // Don't give points for self-likes
          try {
            const postAuthor = await User.findOne({ _id: post.author.userId });
            if (postAuthor) {
              await postAuthor.addReputationPoints(1, 'Post liked');
              await postAuthor.updateStats('likesReceived', 1);
            }
          } catch (error) {
            console.error('Error updating post author reputation:', error);
          }
        }

        // Update liker stats
        try {
          const liker = await User.findById(userId);
          if (liker) {
            await liker.updateStats('likesGiven', 1);
          }
        } catch (error) {
          console.error('Error updating liker stats:', error);
        }
      }
    } else {
      // For comments, we might want to handle this differently
      newLikeCount = await Like.getLikesCount(targetId, targetType);
      await Comment.findByIdAndUpdate(targetId, { likes: newLikeCount });
    }

    // Log activity
    await ActivityLog.create({
      userId,
      action: result.action === 'liked' ? 'like' : 'unlike',
      resource: { type: targetType, id: targetId },
      details: { targetType },
    });

    res.json({
      success: true,
      message: result.action === 'liked' ? `${targetType} liked successfully` : `${targetType} unliked successfully`,
      data: {
        action: result.action,
        likesCount: newLikeCount,
        liked: result.action === 'liked'
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get likes for a post or comment
const getLikes = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Validate target type
    if (!['post', 'comment'].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type. Must be "post" or "comment"'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const likes = await Like.getLikers(targetId, targetType, parseInt(limit));
    const totalLikes = await Like.getLikesCount(targetId, targetType);

    res.json({
      success: true,
      data: {
        likes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalLikes,
          hasMore: skip + likes.length < totalLikes
        }
      }
    });
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check if user has liked a post or comment
const checkUserLike = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    const userId = req.user.id;

    // Validate target type
    if (!['post', 'comment'].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type. Must be "post" or "comment"'
      });
    }

    const hasLiked = await Like.hasUserLiked(userId, targetId, targetType);

    res.json({
      success: true,
      data: {
        liked: !!hasLiked
      }
    });
  } catch (error) {
    console.error('Check user like error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  toggleLike,
  getLikes,
  checkUserLike,
};
