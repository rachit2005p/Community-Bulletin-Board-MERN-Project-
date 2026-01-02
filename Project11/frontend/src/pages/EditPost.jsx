import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    contactInfo: {
      phone: '',
      email: '',
    },
    eventDetails: {
      eventDate: '',
      eventEndDate: '',
      isAllDay: false,
      maxAttendees: '',
    },
    expiresAt: '',
    priority: 'normal',
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'events', label: 'Events' },
    { value: 'jobs', label: 'Jobs' },
    { value: 'alerts', label: 'Alerts' },
    { value: 'lost-found', label: 'Lost & Found' },
    { value: 'services', label: 'Services' },
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setFetchLoading(true);
      const response = await postsAPI.getPost(id);
      const postData = response.data.data.post;

      // Check if user owns this post
      if (postData.author.userId !== user?.userId) {
        setError('You can only edit your own posts');
        return;
      }

      setPost(postData);

      // Populate form with existing data
      setFormData({
        title: postData.title || '',
        content: postData.content || '',
        category: postData.category || 'general',
        tags: postData.tags ? postData.tags.join(', ') : '',
        location: {
          address: postData.location?.address || '',
          city: postData.location?.city || '',
          state: postData.location?.state || '',
          zipCode: postData.location?.zipCode || '',
        },
        contactInfo: {
          phone: postData.contactInfo?.phone || '',
          email: postData.contactInfo?.email || '',
        },
        eventDetails: {
          eventDate: postData.eventDetails?.eventDate ?
            new Date(postData.eventDetails.eventDate).toISOString().slice(0, 16) : '',
          eventEndDate: postData.eventDetails?.eventEndDate ?
            new Date(postData.eventDetails.eventEndDate).toISOString().slice(0, 16) : '',
          isAllDay: postData.eventDetails?.isAllDay || false,
          maxAttendees: postData.eventDetails?.maxAttendees || '',
        },
        expiresAt: postData.metadata?.expiresAt ?
          new Date(postData.metadata.expiresAt).toISOString().slice(0, 16) : '',
        priority: postData.metadata?.priority || 'normal',
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Post not found or you do not have permission to edit it');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Edit handleSubmit called');
    setLoading(true);
    setError('');

    try {
      console.log('Validation passed');
      // Validation
      if (!formData.title.trim() || !formData.content.trim()) {
        throw new Error('Title and content are required');
      }

      console.log('Processing tags');
      // Process tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      console.log('Preparing data');
      // Prepare data
      const postData = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags,
        expiresAt: formData.expiresAt || undefined,
      };

      // Handle event details
      if (formData.category === 'events') {
        // Validate event date is required for events
        if (!formData.eventDetails.eventDate) {
          throw new Error('Event date is required for events');
        }

        // Validate event date is not in the past
        if (new Date(formData.eventDetails.eventDate) < new Date()) {
          throw new Error('Event date cannot be in the past');
        }

        // Validate end date is after start date if provided
        if (formData.eventDetails.eventEndDate && new Date(formData.eventDetails.eventEndDate) <= new Date(formData.eventDetails.eventDate)) {
          throw new Error('Event end date must be after the start date');
        }

        postData.eventDetails = {
          ...formData.eventDetails,
          eventDate: formData.eventDetails.eventDate || undefined,
          eventEndDate: formData.eventDetails.eventEndDate || undefined,
          maxAttendees: formData.eventDetails.maxAttendees ? parseInt(formData.eventDetails.maxAttendees) : undefined,
        };
      } else {
        // Remove event details for non-event posts
        delete postData.eventDetails;
      }

      // Clean up empty objects
      if (!postData.location.address && !postData.location.city) {
        delete postData.location;
      }
      if (!postData.contactInfo.phone && !postData.contactInfo.email) {
        delete postData.contactInfo;
      }

      console.log('Making API call', postData);
      const response = await postsAPI.updatePost(id, postData);
      console.log('Update response', response);

      // Redirect to the updated post
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      setError(error.response?.data?.message || error.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
        <p className="text-gray-600">Make changes to your community post</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter a descriptive title"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your post in detail..."
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. community, event, urgent"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Event Details - Only show for events */}
        {formData.category === 'events' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Event Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventDetails.eventDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="eventDetails.eventDate"
                  name="eventDetails.eventDate"
                  value={formData.eventDetails.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0,16)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={loading}
                  required={formData.category === 'events'}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  When does your event start?
                </p>
              </div>

              <div>
                <label htmlFor="eventDetails.eventEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="eventDetails.eventEndDate"
                  name="eventDetails.eventEndDate"
                  value={formData.eventDetails.eventEndDate}
                  onChange={handleChange}
                  min={formData.eventDetails.eventDate || new Date().toISOString().slice(0,16)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={loading}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  For multi-day events only
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="eventDetails.isAllDay"
                  name="eventDetails.isAllDay"
                  checked={formData.eventDetails.isAllDay}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  disabled={loading}
                />
                <label htmlFor="eventDetails.isAllDay" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  All-day event
                </label>
              </div>

              <div>
                <label htmlFor="eventDetails.maxAttendees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Attendees (Optional)
                </label>
                <input
                  type="number"
                  id="eventDetails.maxAttendees"
                  name="eventDetails.maxAttendees"
                  value={formData.eventDetails.maxAttendees}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g. 50"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Location Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Location (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Street address"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="City"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="location.state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <input
                type="text"
                id="location.state"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="State"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="location.zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                id="location.zipCode"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="ZIP code"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="contactInfo.phone"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="(555) 123-4567"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="contactInfo.email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="contact@example.com"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Expiration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Post Settings</h2>

          <div>
            <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Post Expires At (Optional)
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              min={new Date().toISOString().slice(0,16)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              When should this post expire? {formData.category === 'events' ? 'Events default to 30 days.' : formData.category === 'jobs' ? 'Jobs default to 90 days.' : 'Leave empty for no expiration.'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Post...
              </div>
            ) : (
              'Update Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
