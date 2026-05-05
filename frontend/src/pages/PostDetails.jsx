import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import Comment from '../components/Comment';
import { postsAPI, commentsAPI } from '../services/api';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await postsAPI.deletePost(post._id);
      // Redirect to home page after successful deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(id);
      setPost(response.data.data.post);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getComments(id);
      setComments(response.data.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await commentsAPI.createComment(id, {
        content: newComment.trim(),
      });
      setComments(prev => [...prev, response.data.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentUpdate = (updatedComment, action = 'update') => {
    if (action === 'add') {
      setComments(prev => [...prev, updatedComment]);
    } else if (action === null) {
      // Remove comment
      setComments(prev => prev.filter(c => c._id !== updatedComment._id));
    } else {
      // Update comment
      setComments(prev => prev.map(c =>
        c._id === updatedComment._id ? updatedComment : c
      ));
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Post not found'}
          </h1>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && user.userId === post.author.userId;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Home
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700 capitalize">
          {post.category.replace('-', ' ')}
        </span>
      </nav>

      {/* Post Content */}
      <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {/* Post Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>By {post.author.displayName || post.author.username}</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.metadata.views} views
                </span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
              {post.category.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Post Body */}
        <div className="p-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Location */}
          {post.location && (post.location.city || post.location.address) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-700">
                {[post.location.address, post.location.city, post.location.state].filter(Boolean).join(', ')}
                {post.location.zipCode && ` ${post.location.zipCode}`}
              </p>
            </div>
          )}

          {/* Contact Info */}
          {post.contactInfo && (post.contactInfo.phone || post.contactInfo.email) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-2">Contact Information</h3>
              <div className="text-blue-800">
                {post.contactInfo.phone && <p>Phone: {post.contactInfo.phone}</p>}
                {post.contactInfo.email && <p>Email: {post.contactInfo.email}</p>}
              </div>
            </div>
          )}

          {/* Event Details - Only show for events */}
          {post.category === 'events' && post.eventDetails?.eventDate && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Event Details
              </h3>
              <div className="text-blue-800 space-y-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">
                    {post.eventDetails.isAllDay ? (
                      `Date: ${new Date(post.eventDetails.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}`
                    ) : (
                      `Start: ${new Date(post.eventDetails.eventDate).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}`
                    )}
                  </span>
                </div>

                {post.eventDetails.eventEndDate && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {post.eventDetails.isAllDay ? (
                        `End Date: ${new Date(post.eventDetails.eventEndDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}`
                      ) : (
                        `End: ${new Date(post.eventDetails.eventEndDate).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}`
                      )}
                    </span>
                  </div>
                )}

                {post.eventDetails.maxAttendees && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Maximum Attendees: {post.eventDetails.maxAttendees}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>RSVP Count: {post.eventDetails.rsvpCount || 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Expiration Notice */}
          {post.metadata.expiresAt && new Date(post.metadata.expiresAt) > new Date() && (
            <div className="mt-6 p-4 bg-orange-50 rounded-md">
              <p className="text-orange-800">
                This post expires {formatDistanceToNow(new Date(post.metadata.expiresAt), { addSuffix: true })}
              </p>
            </div>
          )}
        </div>

        {/* Post Actions (for owner) */}
        {isOwner && (
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex space-x-4">
              <Link
                to={`/edit-post/${post._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Post
              </Link>
              <button
                onClick={handleDeletePost}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          </div>
        )}
      </article>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Add a comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                disabled={commentLoading}
              />
            </div>
            <button
              type="submit"
              disabled={commentLoading || !newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700">
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>{' '}
              to join the conversation.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                postId={id}
                onCommentUpdate={handleCommentUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
