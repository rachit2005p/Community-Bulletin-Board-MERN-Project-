import React, { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-xl text-gray-600">
          Please read these terms carefully before using Community Bulletin.
        </p>
        <p className="text-sm text-gray-500 mt-2">Last updated: December 20, 2024</p>
      </div>

      {/* Acceptance */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Agreement to Terms</h2>
        <p className="text-blue-800">
          By accessing and using Community Bulletin, you accept and agree to be bound by the terms and provision of this agreement.
          If you do not agree to abide by the above, please do not use this service.
        </p>
      </div>

      {/* User Accounts */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Accounts</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Creation</h3>
            <p className="text-gray-600">
              You must be at least 13 years old to create an account. You are responsible for maintaining the confidentiality
              of your account credentials and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
            <p className="text-gray-600">
              You agree to provide accurate and complete information when creating your account and to update it promptly
              if any information changes. You are solely responsible for your account activity.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Termination</h3>
            <p className="text-gray-600">
              We reserve the right to suspend or terminate your account at any time for violations of these terms or
              our community guidelines, with or without notice.
            </p>
          </div>
        </div>
      </div>

      {/* Content and Conduct */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Content and User Conduct</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Ownership</h3>
            <p className="text-gray-600">
              You retain ownership of content you create and post. By posting content, you grant us a non-exclusive,
              royalty-free license to use, display, and distribute your content on our platform.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceptable Use</h3>
            <p className="text-gray-600 mb-2">You agree to use the service only for lawful purposes and in accordance with our community guidelines:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>No harassment or discriminatory content</li>
              <li>No spam or misleading information</li>
              <li>No illegal activities or content</li>
              <li>No infringement of intellectual property rights</li>
              <li>No harmful or malicious code</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Moderation</h3>
            <p className="text-gray-600">
              We reserve the right to review, moderate, and remove content that violates these terms or our community guidelines.
              We may also suspend accounts that repeatedly violate our policies.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy and Data */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy and Data Protection</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Information Collection</h3>
            <p className="text-gray-600">
              We collect information as described in our Privacy Policy. By using our service, you consent to our data practices
              as outlined in that document.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Security</h3>
            <p className="text-gray-600">
              We implement reasonable security measures to protect your personal information. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Services</h3>
            <p className="text-gray-600">
              Our service may contain links to third-party websites or services. We are not responsible for the privacy practices
              or content of these external sites.
            </p>
          </div>
        </div>
      </div>

      {/* Service Availability */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Availability and Changes</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Modifications</h3>
            <p className="text-gray-600">
              We reserve the right to modify, suspend, or discontinue any part of our service at any time, with or without notice.
              We will make reasonable efforts to notify users of significant changes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance and Downtime</h3>
            <p className="text-gray-600">
              We may perform maintenance that temporarily makes the service unavailable. We are not liable for any damages
              caused by service interruptions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Beta Features</h3>
            <p className="text-gray-600">
              Some features may be offered as beta versions. These features are provided "as is" and may contain bugs or errors.
            </p>
          </div>
        </div>
      </div>

      {/* Liability and Disclaimers */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Liability and Disclaimers</h2>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Service "As Is"</h4>
            <p className="text-yellow-800 text-sm">
              Our service is provided "as is" and "as available" without warranties of any kind, either express or implied.
              We do not guarantee that the service will be uninterrupted, error-free, or meet your specific requirements.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Limitation of Liability</h4>
            <p className="text-gray-600">
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages arising from your use of the service.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">User-Generated Content</h4>
            <p className="text-gray-600">
              We are not responsible for the accuracy, completeness, or reliability of user-generated content.
              Users are solely responsible for the content they post.
            </p>
          </div>
        </div>
      </div>

      {/* Termination */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Termination</h2>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Account Termination</h4>
            <p className="text-gray-600">
              You may terminate your account at any time. Upon termination, we will delete or anonymize your personal information
              in accordance with our Privacy Policy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Service Termination</h4>
            <p className="text-gray-600">
              We may terminate or suspend your account and access to the service immediately, without prior notice,
              for any reason, including breach of these terms.
            </p>
          </div>
        </div>
      </div>

      {/* Governing Law */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law and Dispute Resolution</h2>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Applicable Law</h4>
            <p className="text-gray-600">
              These terms shall be governed by and construed in accordance with applicable local laws.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Dispute Resolution</h4>
            <p className="text-gray-600">
              Any disputes arising from these terms will be resolved through good faith negotiations.
              If unresolved, disputes may be subject to binding arbitration.
            </p>
          </div>
        </div>
      </div>

      {/* Changes to Terms */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Changes to Terms</h2>
        <p className="text-gray-600 mb-4">
          We reserve the right to modify these terms at any time. We will notify users of significant changes
          through the service or via email. Continued use of the service after changes constitutes acceptance of the new terms.
        </p>
        <p className="text-sm text-gray-500">
          If you have questions about these Terms of Service, please contact us at legal@communitybulletin.com
        </p>
      </div>

      {/* Contact */}
      <div className="text-center text-gray-500">
        <p className="mb-2">Questions about our Terms of Service?</p>
        <p className="text-sm">Contact our legal team at legal@communitybulletin.com</p>
      </div>
    </div>
  );
};

export default TermsOfService;
