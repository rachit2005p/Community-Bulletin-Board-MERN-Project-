import React, { useEffect } from 'react';

const CommunityGuidelines = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const guidelines = [
    {
      title: "Respect All Members",
      description: "Treat everyone with respect and kindness. Harassment, discrimination, or hate speech of any kind is strictly prohibited.",
      icon: "❤️"
    },
    {
      title: "Be Authentic",
      description: "Post genuine content and be honest about what you're sharing. Misleading or false information can harm the community.",
      icon: "✨"
    },
    {
      title: "Protect Privacy",
      description: "Do not share personal information of others without their explicit consent. Respect privacy and maintain confidentiality.",
      icon: "🔒"
    },
    {
      title: "Stay On Topic",
      description: "Post in the appropriate categories and keep content relevant. This helps everyone find what they're looking for.",
      icon: "📌"
    },
    {
      title: "No Spam or Self-Promotion",
      description: "Avoid excessive posting, repetitive content, or blatant self-promotion. Quality content is more valuable than quantity.",
      icon: "🚫"
    },
    {
      title: "Follow Local Laws",
      description: "All content must comply with local laws and regulations. Illegal activities or content promoting harm are not allowed.",
      icon: "⚖️"
    }
  ];

  const prohibitedContent = [
    "Hate speech or discriminatory content",
    "Harassment or bullying",
    "Spam or repetitive posts",
    "Misleading or false information",
    "Illegal activities or content",
    "Personal attacks or threats",
    "Inappropriate or explicit content",
    "Copyright infringement",
    "Solicitation of illegal activities"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
        <p className="text-xl text-gray-600">
          Our guidelines ensure Community Bulletin remains a safe, respectful, and valuable space for everyone.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Welcome to Our Community</h2>
        <p className="text-blue-800">
          Community Bulletin is built on trust, respect, and mutual support. These guidelines help us maintain a positive environment
          where community members can safely share information, find opportunities, and build connections.
        </p>
      </div>

      {/* Core Guidelines */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Core Guidelines</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="text-2xl">{guideline.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{guideline.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{guideline.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prohibited Content */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Don't Allow</h2>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-900 mb-4">Prohibited Content & Behavior</h3>
          <ul className="space-y-2">
            {prohibitedContent.map((item, index) => (
              <li key={index} className="flex items-center text-red-800">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Consequences */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-yellow-900 mb-4">Consequences of Violations</h2>
        <div className="space-y-3 text-yellow-800">
          <p>
            <strong>First Warning:</strong> We'll send you a private message explaining the violation and asking you to correct it.
          </p>
          <p>
            <strong>Content Removal:</strong> Posts that violate guidelines will be removed to maintain community standards.
          </p>
          <p>
            <strong>Account Suspension:</strong> Repeated violations may result in temporary or permanent account suspension.
          </p>
          <p>
            <strong>Appeals:</strong> You can appeal moderation decisions by contacting our support team.
          </p>
        </div>
      </div>

      {/* Reporting */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-green-900 mb-4">Report Violations</h2>
        <p className="text-green-800 mb-4">
          If you see content that violates these guidelines, please help us maintain a positive community by reporting it.
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-300">
          <p className="text-gray-600">
            <strong>How to Report:</strong> Contact our support team with details about the violating content.
            We'll review it promptly and take appropriate action.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500">
        <p className="mb-2">These guidelines help create a positive experience for everyone.</p>
        <p className="text-sm">Thank you for being part of our community! 🌟</p>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
