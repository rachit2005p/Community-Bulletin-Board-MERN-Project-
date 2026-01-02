import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import LikeButton from './LikeButton';

const PostCard = ({ post }) => {
  const getCategoryColor = (category) => {
    const colors = {
      events: 'bg-blue-100 text-blue-800',
      jobs: 'bg-green-100 text-green-800',
      alerts: 'bg-red-100 text-red-800',
      'lost-found': 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800',
      services: 'bg-purple-100 text-purple-800',
    };
    return colors[category] || colors.general;
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link to={`/post/${post._id}`} className="group block">
      <div className="card group-hover:transform group-hover:-translate-y-2 transition-all duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                {post.title}
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)} shadow-soft`}>
              {post.category.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          {/* Content Preview */}
          <p className="text-neutral-600 mb-6 leading-relaxed line-clamp-3">
            {truncateText(post.content)}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-neutral-500 font-medium px-2 py-1">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {(post.author.displayName || post.author.username).charAt(0).toUpperCase()}
                  </span>
                </div>
                <Link
                  to={`/user/${post.author.username}`}
                  className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                >
                  {post.author.displayName || post.author.username}
                </Link>
              </div>
              <span className="text-sm text-neutral-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <LikeButton
                targetId={post._id}
                targetType="post"
                initialLikesCount={post.metadata.likes || 0}
                size="sm"
              />
              <div className="flex items-center space-x-1 text-neutral-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-xs font-medium">{post.metadata.views}</span>
              </div>
              <div className="flex items-center space-x-1 text-neutral-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs font-medium">{post.metadata.commentsCount}</span>
              </div>
            </div>
          </div>

          {/* Location (if available) */}
          {post.location && (post.location.city || post.location.address) && (
            <div className="mt-4 flex items-center text-sm text-neutral-500 bg-neutral-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">
                {[post.location.city, post.location.address].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Event Date - Only show for events */}
          {post.category === 'events' && post.eventDetails?.eventDate && (
            <div className="mt-4 flex items-center text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">
                {post.eventDetails.isAllDay ? (
                  `Event: ${new Date(post.eventDetails.eventDate).toLocaleDateString()}`
                ) : (
                  `Event: ${new Date(post.eventDetails.eventDate).toLocaleString()}`
                )}
                {post.eventDetails.eventEndDate && (
                  ` - ${post.eventDetails.isAllDay ?
                    new Date(post.eventDetails.eventEndDate).toLocaleDateString() :
                    new Date(post.eventDetails.eventEndDate).toLocaleString()}`
                )}
                {post.eventDetails.maxAttendees && (
                  <span className="ml-2 text-xs">
                    (Max: {post.eventDetails.maxAttendees} attendees)
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Expiration notice */}
          {post.metadata.expiresAt && new Date(post.metadata.expiresAt) > new Date() && (
            <div className="mt-4 flex items-center text-sm text-warning-600 bg-warning-50 dark:bg-warning-900/20 dark:text-warning-400 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium">
                Expires {formatDistanceToNow(new Date(post.metadata.expiresAt), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
