import React from 'react';
import { CardSection, Card } from '../CardComponents';
import {
  DocumentRegular,
  BookRegular,
  DocumentTextRegular,
  DocumentBulletListRegular,
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';

export default function Whitepapers() {
  return (
    <div className="noise-bg w-full">
      <section className="mx-auto mb-16 md:mb-32 w-full max-w-[90vw] 2xl:max-w-[80vw] flex flex-col p-4 py-0">
        <div className="flex flex-col items-center justify-between py-8 md:py-14">
          <h2 className="mb-4 font-jakarta text-3xl md:text-5xl font-bold text-center">Whitepapers</h2>
          <p className="max-w-xl text-center text-text-400 px-4 md:px-0">
            Explore our comprehensive whitepapers that detail the technical architecture, security measures, and innovative approaches behind Intuition's knowledge graph.
          </p>
        </div>
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 place-items-center justify-items-center">
            <Card
              title="Intuition Whitepaper"
              icon={<DocumentRegular className="w-8 h-8" />}
              description="A detailed technical overview of Intuition's decentralized knowledge graph architecture and its core components."
              to="https://github.com/0xIntuition/intuition-whitepaper/blob/main/intuition_whitepaper.pdf"
              className="p-6 md:p-8 h-full w-full max-w-md transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout"
            />
            <Card
              title="Intuition Litepaper"
              icon={<BookRegular className="w-8 h-8" />}
              description="A higher-level overview of the Intuition protocol and its respective core components."
              to="https://github.com/0xIntuition/intuition-whitepaper/blob/main/intuition_litepaper.pdf"
              className="p-6 md:p-8 h-full w-full max-w-md transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout"
            />
            <Card
              title="AgentRank Whitepaper"
              icon={<DocumentTextRegular className="w-8 h-8" />}
              description="An in-depth analysis of our agent reputation scoring system and its role in maintaining data quality and trust in the Agentic Era."
              to="https://github.com/0xIntuition/agent-rank/blob/main/agentrank.md"
              className="p-6 md:p-8 h-full w-full max-w-md transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout"
            />
            <Card
              title="Neuro-Symbolic AI Whitepaper"
              icon={<DocumentBulletListRegular className="w-8 h-8" />}
              description="Coming Soon."
              to="#"
              className="p-6 md:p-8 h-full w-full max-w-md transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg vertical-layout"
            />
          </div>
        </div>
        <div className="mt-16 flex justify-center">
          <Link
            to="/whitepapers"
            className="explore-ecosystem-btn"
          >
            View All Whitepapers
          </Link>
        </div>
      </section>
    </div>
  );
} 