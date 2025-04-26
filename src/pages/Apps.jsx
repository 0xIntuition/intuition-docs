import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { CardSection, Card } from '../components/CardComponents';
import {
  ChatMultipleRegular,
  LiveRegular,
  CurrencyDollarEuroFilled,
  PersonStarburstRegular,
  DataTrendingRegular,
  PeopleTeamRegular,
  SearchRegular,
} from '@fluentui/react-icons';
import Fuse from 'fuse.js';

const apps = [
  {
    title: "The Portal",
    icon: <PersonStarburstRegular />,
    description: "A decentralized messaging platform that leverages reputation scores for spam prevention and content relevance.",
    to: "#",
  },
  {
    title: "AI Chat",
    icon: <ChatMultipleRegular />,
    description: "Discover and evaluate expert opinions on any topic, backed by verifiable credentials and reputation metrics.",
    to: "#",
  },
  {
    title: "Data Uploader",
    icon: <CurrencyDollarEuroFilled />,
    description: "A marketplace for high-quality datasets, where contributors earn rewards based on usage and validation.",
    to: "#",
  },
  {
    title: "Live Events",
    icon: <LiveRegular />,
    description: "Join live discussions and events with verified experts, powered by our reputation system.",
    to: "#",
  },
  {
    title: "Analytics Dashboard",
    icon: <DataTrendingRegular />,
    description: "Track and analyze reputation metrics and knowledge graph insights across the ecosystem.",
    to: "#",
  },
  {
    title: "Community Hub",
    icon: <PeopleTeamRegular />,
    description: "Connect with other users, share insights, and build your reputation within the community.",
    to: "#",
  },
];

export default function Apps() {
  const [searchQuery, setSearchQuery] = useState('');

  const fuse = useMemo(() => new Fuse(apps, {
    keys: ['title', 'description'],
    threshold: 0.3,
    includeScore: true,
  }), []);

  const filteredApps = useMemo(() => {
    if (!searchQuery) return apps;
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, fuse]);

  return (
    <Layout
      title="Intuition Ecosystem"
      description="Explore our growing ecosystem of applications built on Intuition's knowledge graph and reputation systems."
    >
      <div className="noise-bg min-h-screen">
        <section className="mx-auto mb-32 flex w-full max-w-7xl flex-col p-4 py-16">
          <div className="flex flex-col items-center justify-between py-14">
            <h1 className="mb-4 font-jakarta text-5xl font-bold">Intuition Ecosystem</h1>
            <p className="max-w-xl text-center text-text-400">
              Explore our growing ecosystem of applications built on Intuition's knowledge graph and reputation systems.
            </p>
          </div>
          
          <div className="mb-16 flex w-full max-w-lg items-center rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <SearchRegular className="mr-2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map((app, index) => (
              <Card
                key={index}
                title={app.title}
                icon={app.icon}
                description={app.description}
                to={app.to}
                className="py-8"
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
} 