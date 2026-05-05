const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');



// Public routes (optional authentication)
router.get('/', optionalAuth, postController.getPosts);
router.get('/categories', postController.getCategories);

// Protected routes (require authentication)
router.post('/', authenticateToken, postController.createPost);
router.get('/user/:userId', authenticateToken, postController.getUserPosts);

// Routes with ID parameter (must come after more specific routes)
router.get('/:id', optionalAuth, postController.getPostById);
router.put('/:id', authenticateToken, postController.updatePost);
router.delete('/:id', authenticateToken, postController.deletePost);

module.exports = router;
