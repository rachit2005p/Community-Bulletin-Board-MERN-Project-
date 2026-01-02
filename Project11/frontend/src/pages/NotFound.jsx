import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>

          <div className="text-sm text-gray-500">
            Or try one of these:
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              to="/?category=events"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Browse Events
            </Link>
            <Link
              to="/?category=jobs"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              to="/?category=services"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
