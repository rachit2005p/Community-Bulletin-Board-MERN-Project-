import React, { useEffect } from 'react';

const HelpCenter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "How do I create a post?",
      answer: "To create a post, log in to your account and click on the 'Create Post' button in the navigation bar. Fill in the title, content, and select a category. You can also add tags, location, and contact information."
    },
    {
      question: "How do I edit or delete my posts?",
      answer: "Go to your Dashboard and click on 'My Posts'. You'll see all your posts with edit and delete options. You can only edit or delete your own posts."
    },
    {
      question: "How do I upload a profile picture?",
      answer: "Go to your Dashboard → Profile Settings. Click 'Change Picture' and select an image file (JPG, PNG, or GIF, max 5MB). Your profile picture will appear in the header and throughout the site."
    },
    {
      question: "What categories are available for posts?",
      answer: "We have several categories: General, Events, Jobs, Services, Lost & Found, and Alerts. Choose the most appropriate category for your post."
    },
    {
      question: "How do I contact a post author?",
      answer: "If the post includes contact information, you'll see phone and email details. You can also reply to posts to ask questions."
    },
    {
      question: "Can I search for specific posts?",
      answer: "Yes! Use the search bar at the top of the page. You can search by keywords, and also filter by category using the category buttons."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "If you see inappropriate content, please contact our support team. We take community guidelines seriously and will review reported content promptly."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we take privacy seriously. Your personal information is protected, and we only share contact details when explicitly provided by post authors."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions and get help with using Community Bulletin.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/create-post"
            className="flex items-center p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Create a Post</h3>
              <p className="text-sm text-gray-500">Share something with your community</p>
            </div>
          </a>
          <a
            href="/dashboard"
            className="flex items-center p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Your Posts</h3>
              <p className="text-sm text-gray-500">Edit or delete your content</p>
            </div>
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gray-50 rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
        <p className="text-gray-600 mb-6">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
          <p className="text-gray-600 mb-4">
            For additional support, please reach out to our team. We're committed to providing excellent service to our community members.
          </p>
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@communitybulletin.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
