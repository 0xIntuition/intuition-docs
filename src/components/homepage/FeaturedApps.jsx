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
      <section className="mx-auto mb-8 md:mb-16 w-full max-w-[90vw] 2xl:max-w-[80vw] flex flex-col p-2 py-0">
        <div className="flex flex-col items-center justify-between py-4 md:py-8 mt-8 md:mt-12">
          <h2 className="mb-2 font-jakarta text-2xl md:text-3xl font-bold text-center">Featured Apps</h2>
          <p className="max-w-lg text-center text-text-400 px-2 md:px-0 text-sm md:text-base">
            Discover innovative applications built on Intuition's knowledge graph. These apps showcase the power of decentralized data and reputation systems.
          </p>
        </div>
        <div className="mx-auto w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center justify-items-center">
            <Card
              title="The Portal"
              icon={<PersonStarburstRegular className="w-6 h-6" />}
              description="The flagship app of Intuition, and the first Intuition explorer."
              to="https://portal.intuition.systems"
              className="p-4 md:p-5 h-full w-full max-w-xs transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout text-sm"
            />
            <Card
              title="The Launchpad"
              icon={<ChatMultipleRegular className="w-6 h-6" />}
              description="Complete quests and earn IQ points as you learn more about Intuition through structured experiences."
              to="https://launchpad.intuition.systems"
              className="p-4 md:p-5 h-full w-full max-w-xs transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout text-sm"
            />
            <Card
              title="Data Uploader"
              icon={<CurrencyDollarEuroFilled className="w-6 h-6" />}
              description="Upload data en-masse to Intuition, and get rewarded for your contributions."
              to="https://upload.intuition.systems"
              className="p-4 md:p-5 h-full w-full max-w-xs transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout text-sm"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            to="/apps"
            className="explore-ecosystem-btn px-4 py-2 text-sm md:text-base"
          >
            Explore Ecosystem
          </Link>
        </div>
      </section>
    </div>
  );
} 