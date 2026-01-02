import React from 'react';

const SkeletonLoader = ({ type = 'post', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'post':
        return (
          <div className="card animate-pulse">
            <div className="p-6">
              {/* Header skeleton */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20"></div>
              </div>

              {/* Content skeleton */}
              <div className="mb-6">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-4/6"></div>
              </div>

              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-16"></div>
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20"></div>
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-14"></div>
              </div>

              {/* Footer skeleton */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'comment':
        return (
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'post-card':
        return (
          <div className="card animate-pulse">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-3/4 mb-2"></div>
                </div>
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20"></div>
              </div>
              <div className="mb-6">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-4/6"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8"></div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
