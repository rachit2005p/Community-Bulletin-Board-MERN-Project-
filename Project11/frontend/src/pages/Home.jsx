import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { postsAPI } from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  const categoriesList = [
    { key: 'all', label: 'All Posts', color: 'bg-gray-100 text-gray-800' },
    { key: 'events', label: 'Events', color: 'bg-blue-100 text-blue-800', icon: '📅' },
    { key: 'jobs', label: 'Jobs', color: 'bg-green-100 text-green-800' },
    { key: 'alerts', label: 'Alerts', color: 'bg-red-100 text-red-800' },
    { key: 'lost-found', label: 'Lost & Found', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
    { key: 'services', label: 'Services', color: 'bg-purple-100 text-purple-800' },
  ];

  const fetchPosts = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setPosts([]);
      }

      const params = {
        limit: 12,
        skip: loadMore ? posts.length : 0,
      };

      if (category !== 'all') {
        params.category = category;
      }

      if (search) {
        params.search = search;
      }

      const response = await postsAPI.getPosts(params);
      const newPosts = response.data.data.posts;

      if (loadMore) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setHasMore(response.data.data.pagination.hasMore);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await postsAPI.getCategories();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category, search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (newCategory) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    params.delete('search'); // Clear search when changing category
    setSearchParams(params);
  };

  const handleSearch = (searchTerm) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const loadMorePosts = () => {
    fetchPosts(true);
  };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft mb-6">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-neutral-600">Community Hub Active</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 mb-6 leading-tight">
            Discover Your
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Community
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Connect with neighbors, find local opportunities, share events, and build stronger communities together.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search posts, events, jobs..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-modern pl-14 pr-4 py-4 text-lg shadow-large w-full"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesList.map((cat, index) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`group px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  category === cat.key
                    ? `${cat.color} text-white shadow-large scale-105`
                    : 'bg-white/80 backdrop-blur-sm text-neutral-700 hover:bg-white hover:shadow-medium border border-neutral-200'
                }`}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <span className="flex items-center space-x-2">
                  {cat.icon && <span>{cat.icon}</span>}
                  <span>{cat.label}</span>
                  {categories[cat.key] && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      category === cat.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {categories[cat.key].count}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonLoader type="post-card" count={6} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-danger-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-neutral-600 mb-6">{error}</p>
            <button
              onClick={() => fetchPosts()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-large">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-4">
                  {search ? 'No posts found' : 'Be the first to post!'}
                </h3>
                <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                  {search
                    ? 'We couldn\'t find any posts matching your search. Try different keywords or browse all posts.'
                    : 'Share your first community post to help others discover local events, jobs, and services.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {search && (
                    <button
                      onClick={() => handleSearch('')}
                      className="btn-secondary"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => window.location.href = '/create-post'}
                    className="btn-primary"
                  >
                    Create First Post
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.map((post, index) => (
                    <div
                      key={post._id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center">
                    <button
                      onClick={loadMorePosts}
                      disabled={loadingMore}
                      className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loadingMore ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          Discovering more posts...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Load More Posts</span>
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Call to Action for New Users */}
        <div className="mt-20 glass-effect rounded-3xl p-12 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-4">
              Ready to Join the Community?
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed mb-8">
              Share your local events, post job opportunities, offer services, and connect with neighbors who make your community special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary px-8 py-4 text-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Get Started Free
              </Link>
              <Link
                to="/"
                className="btn-secondary px-8 py-4 text-lg"
              >
                Explore Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
