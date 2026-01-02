import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import SkeletonLoader from '../components/SkeletonLoader';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getUserProfile(userId);
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('User not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await postsAPI.getPosts({
        authorId: user._id,
        limit: 20
      });
      setPosts(response.data.data.posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const getReputationColor = (level) => {
    const colors = {
      'Newbie': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      'Contributor': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Trusted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Moderator': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[level] || colors.Newbie;
  };

  const getReputationIcon = (level) => {
    const icons = {
      'Newbie': '🌱',
      'Contributor': '📝',
      'Trusted': '✅',
      'Expert': '⭐',
      'Moderator': '🛡️',
    };
    return icons[level] || icons.Newbie;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <SkeletonLoader type="profile" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-24 h-24 bg-danger-100 dark:bg-danger-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            {error || 'User not found'}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            The user you're looking for doesn't exist or may have been removed.
          </p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                {user.profile?.avatar ? (
                  <img
                    src={`http://localhost:5000${user.profile.avatar}`}
                    alt={`${user.displayName}'s avatar`}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-neutral-800 shadow-large"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-large">
                    {user.displayName?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 border-4 border-white dark:border-neutral-800 rounded-full"></div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      {user.displayName || user.username}
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">@{user.username}</p>
                  </div>

                  {/* Reputation Badge */}
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${getReputationColor(user.reputation?.level)}`}>
                    <span>{getReputationIcon(user.reputation?.level)}</span>
                    <span>{user.reputation?.level || 'Newbie'}</span>
                    <span className="text-xs opacity-75">({user.reputation?.points || 0} pts)</span>
                  </div>
                </div>

                {/* Bio */}
                {user.profile?.bio && (
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                    {user.profile.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {user.reputation?.stats?.postsCount || 0}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                      {user.reputation?.stats?.commentsCount || 0}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                      {user.reputation?.stats?.likesReceived || 0}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: false })}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Joined</div>
                  </div>
                </div>

                {/* Badges */}
                {user.reputation?.badges && user.reputation.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {user.reputation.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-medium"
                      >
                        <span>{badge.type}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'posts'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-medium'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Posts ({user.reputation?.stats?.postsCount || 0})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'comments'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-medium'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Comments ({user.reputation?.stats?.commentsCount || 0})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div>
            {postsLoading ? (
              <div className="space-y-6">
                <SkeletonLoader type="post-card" count={3} />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  No posts yet
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                  {user.username} hasn't created any posts yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Comments feature coming soon
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              We're working on adding a comprehensive comments system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
