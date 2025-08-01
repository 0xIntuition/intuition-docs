import React from 'react';
import { CardSection, Card } from '../CardComponents';
import {
  ChatMultipleRegular,
  LiveRegular,
  CurrencyDollarEuroFilled,
  PersonStarburstRegular,
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';

export default function FeaturedApps() {
  return (
    <div className="noise-bg w-full py-20">
      <section className="mx-auto w-full max-w-7xl flex flex-col px-4">
        <div className="flex flex-col items-center justify-between py-8 md:py-12">
          <h2 className="mb-6 font-jakarta text-3xl md:text-5xl font-bold text-center">Featured Apps</h2>
          <p className="max-w-2xl text-center text-lg text-text-400">
            Discover innovative applications built on Intuition's knowledge graph. These apps showcase the power of decentralized data and reputation systems.
          </p>
        </div>
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center justify-items-center">
            <Card
              title="The Portal"
              icon={<PersonStarburstRegular className="w-8 h-8" />}
              description="The flagship app of Intuition, and the first Intuition explorer."
              to="https://portal.intuition.systems"
              className="p-6 md:p-8 h-full w-full max-w-md transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout"
            />
            <Card
              title="The Launchpad"
              icon={<ChatMultipleRegular className="w-8 h-8" />}
              description="Complete quests and earn IQ points as you learn more about Intuition through structured experiences."
              to="https://launchpad.intuition.systems"
              className="p-6 md:p-8 h-full w-full max-w-md transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout"
            />
            <Card
              title="Data Uploader"
              icon={<CurrencyDollarEuroFilled className="w-8 h-8" />}
              description="Upload data en-masse to Intuition, and get rewarded for your contributions."
              to="https://upload.intuition.systems"
              className="p-6 md:p-8 h-full w-full max-w-md transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout"
            />
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            to="/apps"
            className="explore-ecosystem-btn"
          >
            Explore Ecosystem
          </Link>
        </div>
      </section>
    </div>
  );
} 