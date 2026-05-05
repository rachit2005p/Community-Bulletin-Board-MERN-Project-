import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { likesAPI } from '../services/api';

const LikeButton = ({ targetId, targetType, initialLikesCount = 0, size = 'sm' }) => {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Check if user has liked this item on mount
  useEffect(() => {
    if (isAuthenticated && !hasChecked) {
      checkUserLike();
    }
  }, [isAuthenticated, targetId, targetType, hasChecked]);

  const checkUserLike = async () => {
    try {
      const response = await likesAPI.checkUserLike(targetId, targetType);
      setIsLiked(response.data.data.liked);
      setHasChecked(true);
    } catch (error) {
      console.error('Error checking like status:', error);
      setHasChecked(true);
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const wasLiked = isLiked;

    // Optimistic update
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      const response = await likesAPI.toggleLike(targetId, targetType);
      const { action, likesCount: newLikesCount } = response.data.data;

      // Update with server response
      setIsLiked(action === 'liked');
      setLikesCount(newLikesCount);
    } catch (error) {
      console.error('Error toggling like:', error);

      // Revert optimistic update on error
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`group flex items-center space-x-2 rounded-xl transition-all duration-200 ${
        isLiked
          ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
          : 'text-neutral-500 hover:text-red-600 dark:hover:text-red-400 bg-neutral-50 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/20'
      } ${sizeClasses[size]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isLiked ? 'Unlike' : 'Like'}
    >
      <div className="relative">
        {/* Heart Icon */}
        <svg
          className={`${iconSizeClasses[size]} transition-all duration-200 ${
            isLiked ? 'fill-current scale-110' : 'fill-none'
          } ${isLoading ? 'animate-pulse' : ''}`}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>

        {/* Animated particles for like effect */}
        {isLiked && !isLoading && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-1 right-0 w-0.5 h-0.5 bg-red-400 rounded-full animate-ping opacity-60 animation-delay-100"></div>
            <div className="absolute bottom-0 left-0 w-0.5 h-0.5 bg-red-400 rounded-full animate-ping opacity-60 animation-delay-200"></div>
          </div>
        )}
      </div>

      {/* Likes Count */}
      {likesCount > 0 && (
        <span className={`font-semibold transition-all duration-200 ${
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        }`}>
          {likesCount}
        </span>
      )}
    </button>
  );
};

export default LikeButton;
