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
    <div className="noise-bg w-full">
      <section className="mx-auto mb-16 md:mb-32 w-full max-w-[90vw] 2xl:max-w-[80vw] flex flex-col p-4 py-0">
        <div className="flex flex-col items-center justify-between py-8 md:py-14 mt-16 md:mt-32">
          <h2 className="mb-4 font-jakarta text-3xl md:text-5xl font-bold text-center">Featured Apps</h2>
          <p className="max-w-xl text-center text-text-400 px-4 md:px-0">
            Discover innovative applications built on Intuition's knowledge graph. These apps showcase the power of decentralized data and reputation systems.
          </p>
        </div>
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 place-items-center justify-items-center">
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
        <div className="mt-16 flex justify-center">
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