const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');
const { authenticateToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for like actions (prevent spam)
const likeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 like actions per windowMs
  message: {
    success: false,
    message: 'Too many like actions, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});


// Toggle like (like/unlike)
router.post('/:targetId/:targetType',
  authenticateToken,
  likeLimiter,
  likesController.toggleLike
);

// Get likes for target
router.get('/:targetId/:targetType', likesController.getLikes);

// Check if authenticated user has liked target
router.get('/check/:targetId/:targetType',
  authenticateToken,
  likesController.checkUserLike
);

module.exports = router;
