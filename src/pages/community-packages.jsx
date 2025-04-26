import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function CommunityPackages() {
  return (
    <Layout
      title="Community Packages"
      description="Documentation for Intuition Community Packages"
    >
      <div className="mx-auto max-w-6xl p-4">
        <h1 className="mb-8 text-4xl font-bold">Community Packages</h1>
        
        <p className="text-lg text-text-400 mb-8">
          Welcome to the Community Packages documentation. Here you'll find packages created by the Intuition community to extend and enhance the core functionality.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example package card - you can add more as needed */}
          <div className="border border-secondary-700 rounded-lg p-6 hover:border-primary transition-colors">
            <h3 className="text-2xl font-semibold mb-2">Package Name</h3>
            <p className="text-text-400 mb-4">
              Brief description of what this community package does and its main features.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="#"
                className="text-primary hover:text-primary-dark"
              >
                Documentation →
              </Link>
              <Link
                to="#"
                className="text-primary hover:text-primary-dark"
              >
                GitHub →
              </Link>
            </div>
          </div>

          {/* Add more package cards here */}
        </div>

        <div className="mt-12 p-6 bg-secondary-800 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Submit Your Package</h2>
          <p className="text-text-400 mb-4">
            Have you built something amazing with Intuition? Share it with the community!
          </p>
          <Link
            to="https://github.com/0xintuition/intuition-docs/issues/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Submit Package →
          </Link>
        </div>
      </div>
    </Layout>
  );
} 