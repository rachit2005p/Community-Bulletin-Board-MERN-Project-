import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
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
    console.log('handleSubmit called');
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

      console.log('Cleaning up data');
      // Clean up empty objects
      if (!postData.location.address && !postData.location.city) {
        delete postData.location;
      }
      if (!postData.contactInfo.phone && !postData.contactInfo.email) {
        delete postData.contactInfo;
      }

      console.log('Making API call', postData);

      // Try with minimal data first
      const minimalData = {
        title: postData.title,
        content: postData.content,
        category: postData.category
      };
      console.log('Trying with minimal data:', minimalData);

      const response = await postsAPI.createPost(minimalData);
      console.log('API response', response);
      navigate(`/post/${response.data.data.post._id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      setError(error.response?.data?.message || error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p className="text-gray-600">Share something with your community</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a descriptive title"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your post in detail..."
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. community, event, urgent"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Location (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="location.state" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                id="location.state"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="State"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="location.zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                id="location.zipCode"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ZIP code"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="contactInfo.phone"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 123-4567"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="contactInfo.email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@example.com"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Event Details - Only show for events */}
        {formData.category === 'events' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Event Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventDetails.eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="eventDetails.eventDate"
                  name="eventDetails.eventDate"
                  value={formData.eventDetails.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0,16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  required={formData.category === 'events'}
                />
                <p className="mt-1 text-sm text-gray-500">
                  When does your event start?
                </p>
              </div>

              <div>
                <label htmlFor="eventDetails.eventEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="eventDetails.eventEndDate"
                  name="eventDetails.eventEndDate"
                  value={formData.eventDetails.eventEndDate}
                  onChange={handleChange}
                  min={formData.eventDetails.eventDate || new Date().toISOString().slice(0,16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <p className="mt-1 text-sm text-gray-500">
                  For multi-day events only
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="eventDetails.isAllDay"
                  name="eventDetails.isAllDay"
                  checked={formData.eventDetails.isAllDay}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      eventDetails: {
                        ...prev.eventDetails,
                        isAllDay: e.target.checked,
                      },
                    }));
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="eventDetails.isAllDay" className="ml-2 block text-sm text-gray-700">
                  All-day event
                </label>
              </div>

              <div>
                <label htmlFor="eventDetails.maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Attendees (Optional)
                </label>
                <input
                  type="number"
                  id="eventDetails.maxAttendees"
                  name="eventDetails.maxAttendees"
                  value={formData.eventDetails.maxAttendees}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. 50"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Expiration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Post Settings</h2>

          <div>
            <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
              Post Expires At (Optional)
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              min={new Date().toISOString().slice(0,16)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              When should this post expire? {formData.category === 'events' ? 'Events default to 30 days.' : formData.category === 'jobs' ? 'Jobs default to 90 days.' : 'Leave empty for no expiration.'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Post...
              </div>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
