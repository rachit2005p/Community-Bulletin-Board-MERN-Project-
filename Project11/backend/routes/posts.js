const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');



// Public routes (optional authentication)
router.get('/', optionalAuth, postController.getPosts);
router.get('/categories', postController.getCategories);
router.get('/:id', optionalAuth, postController.getPostById);

// Protected routes (require authentication)
router.post('/', authenticateToken, postController.createPost);
router.put('/:id', authenticateToken, postController.updatePost);
router.delete('/:id', authenticateToken, postController.deletePost);
router.get('/user/:userId', authenticateToken, postController.getUserPosts);

module.exports = router;
