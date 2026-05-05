const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');



// Public routes
router.get('/:postId', commentController.getComments);
router.get('/thread/:commentId', commentController.getCommentThread);

// Protected routes (require authentication)
router.post('/:postId', authenticateToken, commentController.createComment);
router.put('/:commentId', authenticateToken, commentController.updateComment);
router.delete('/:commentId', authenticateToken, commentController.deleteComment);
router.post('/:commentId/like', authenticateToken, commentController.toggleCommentLike);

module.exports = router;
