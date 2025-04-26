import React from 'react';
import Layout from '@theme/Layout';
import Whitepapers from '../components/homepage/Whitepapers';

export default function WhitepapersPage() {
  return (
    <Layout
      title="Whitepapers | Intuition Documentation"
      description="Explore our comprehensive whitepapers that detail the technical architecture, security measures, and innovative approaches behind Intuition's knowledge graph."
    >
      <div className="container margin-vert--lg">
        <Whitepapers />
      </div>
    </Layout>
  );
} 