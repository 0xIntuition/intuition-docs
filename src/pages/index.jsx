import React, { useState } from 'react';
import Layout from '@theme/Layout';

import HeroSection from '../components/homepage/HeroSection';
import APIReferenceSection from '../components/homepage/APIReferenceSection';
import CommunitySection from '../components/homepage/CommunitySection';
import HomeFooter from '../components/homepage/HomeFooter';
import ResourcesSection from '../components/homepage/ResourcesSection';
import Head from '@docusaurus/Head';
import GuidesAndSamples from '../components/homepage/GuidesAndSamples';
import SDKs from '../components/homepage/SDKs';
import Link from '@docusaurus/Link';
import PhHelloBar from '../components/homepage/PhHelloBar';
import FeaturedApps from '../components/homepage/FeaturedApps';
import Whitepapers from '../components/homepage/Whitepapers';

export default function Homepage() {
  return (
    <Layout
      title="Intuition Documentation"
      wrapperClassName="homepage flex flex-col"
      noFooter
    >
      <Head>
        <link rel="prefetch" href="/assets/css/elements.min.css" />
      </Head>

      <HeroSection />

      {/* <FeaturedApps /> */}

      {/* <Whitepapers /> */}

      <GuidesAndSamples />

      <SDKs />

      <APIReferenceSection />

      <ResourcesSection />

      <CommunitySection />

      <HomeFooter />
    </Layout>
  );
}
