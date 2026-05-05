import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: December 20, 2024</p>
      </div>

      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Our Commitment to Privacy</h2>
        <p className="text-blue-800">
          Community Bulletin is committed to protecting your privacy and being transparent about our data practices.
          This privacy policy explains how we collect, use, and safeguard your information.
        </p>
      </div>

      {/* Information We Collect */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
            <p className="text-gray-600 mb-2">When you create an account, we collect:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Username and email address</li>
              <li>First and last name (optional)</li>
              <li>Profile picture (optional)</li>
              <li>Account creation and last login dates</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Content You Create</h3>
            <p className="text-gray-600 mb-2">When you post content, we collect:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Post titles, content, and metadata</li>
              <li>Categories and tags</li>
              <li>Location information (if provided)</li>
              <li>Contact information (if provided)</li>
              <li>Images and attachments</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
            <p className="text-gray-600 mb-2">We automatically collect:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>IP addresses and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Search queries and interactions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How We Use Information */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Provide Services</h4>
              <p className="text-gray-600 text-sm">To create and manage your account, display your posts, and connect you with other community members.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Improve Platform</h4>
              <p className="text-gray-600 text-sm">To analyze usage patterns and improve our features and user experience.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Ensure Safety</h4>
              <p className="text-gray-600 text-sm">To prevent fraud, abuse, and ensure compliance with our community guidelines.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Legal Compliance</h4>
              <p className="text-gray-600 text-sm">To comply with legal obligations and protect our rights and those of our users.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Sharing */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing & Disclosure</h2>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">What We Share</h4>
            <ul className="text-green-800 space-y-1">
              <li>• Public posts and profile information you choose to share</li>
              <li>• Contact information you include in posts (when provided)</li>
              <li>• Aggregated, anonymized data for analytics</li>
            </ul>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-2">What We Don't Share</h4>
            <ul className="text-red-800 space-y-1">
              <li>• Your email address (except in posts where you explicitly include it)</li>
              <li>• Private account information</li>
              <li>• Personal data for marketing without consent</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Security */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>

        <div className="space-y-4">
          <p className="text-gray-600">
            We implement industry-standard security measures to protect your information:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🔐</div>
              <h4 className="font-semibold text-gray-900 mb-1">Encryption</h4>
              <p className="text-sm text-gray-600">Data encrypted in transit and at rest</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🛡️</div>
              <h4 className="font-semibold text-gray-900 mb-1">Access Control</h4>
              <p className="text-sm text-gray-600">Limited access to personal data</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900 mb-1">Regular Audits</h4>
              <p className="text-sm text-gray-600">Security monitoring and updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Rights */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights & Choices</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Access & Control</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Access your personal data</li>
              <li>• Correct inaccurate information</li>
              <li>• Delete your account and data</li>
              <li>• Export your data</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Communication Preferences</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Opt out of marketing emails</li>
              <li>• Control notification settings</li>
              <li>• Manage privacy settings</li>
              <li>• Update account preferences</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          If you have questions about this Privacy Policy or our data practices, please contact us:
        </p>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy Inquiries</h4>
              <div className="flex items-center text-gray-600 mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                privacy@communitybulletin.com
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">General Support</h4>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                support@communitybulletin.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
