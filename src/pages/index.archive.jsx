import React, { useState } from 'react';
import Layout from '@theme/Layout';

import HeroSection from '../components/homepage/HeroSection';
import CommunitySection from '../components/homepage/CommunitySection';
import HomeFooter from '../components/homepage/HomeFooter';
import ResourcesSection from '../components/homepage/ResourcesSection';
import Head from '@docusaurus/Head';
import GuidesAndSamples from '../components/homepage/GuidesAndSamples';
import Whitepapers from '../components/homepage/Whitepapers';

export default function Homepage() {
  return (
    <Layout
      title="Intuition Documentation"
      wrapperClassName="homepage flex flex-col bg-white dark:bg-black"
      noFooter
    >
      <Head>
        <link rel="prefetch" href="/assets/css/elements.min.css" />
      </Head>

      <HeroSection />

      <Whitepapers />

      <GuidesAndSamples />

      <ResourcesSection />

      <CommunitySection />

      <HomeFooter />
    </Layout>
  );
}
