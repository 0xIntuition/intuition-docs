import React, { useRef, useEffect } from 'react';
import { CardSection, Card } from '../CardComponents';
import {
  DocumentRegular,
  BookRegular,
  DocumentTextRegular,
  DocumentBulletListRegular,
} from '@fluentui/react-icons';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

function WhitepaperCard({ title, icon: Icon, description, to, className, index }) {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Removed colorful gradients
  
  return (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      ref={cardRef}
      className={clsx(
        'whitepaper-card group relative block h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:no-underline dark:border-gray-800 dark:bg-[#1a1a1a] dark:shadow-xl dark:shadow-black/50 md:p-8',
        className,
        `whitepaper-delay-${index}`
      )}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-center">
          <div className="icon-bubble relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl transition-all duration-500 group-hover:scale-110" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <Icon className="h-8 w-8 text-primary transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
        </div>
        <h3 className="mb-3 text-center text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary dark:text-white">
          {title}
        </h3>
        <p className="text-center text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </a>
  );
}

export default function Whitepapers() {
  const papers = [
    {
      title: "Intuition Whitepaper",
      icon: DocumentRegular,
      description: "A detailed technical overview of Intuition's decentralized knowledge graph architecture and its core components.",
      to: "https://github.com/0xIntuition/intuition-whitepaper/blob/main/intuition_whitepaper.pdf",
    },
    {
      title: "Intuition Litepaper",
      icon: BookRegular,
      description: "A higher-level overview of the Intuition protocol and its respective core components.",
      to: "https://github.com/0xIntuition/intuition-whitepaper/blob/main/intuition_litepaper.pdf",
    },
    {
      title: "AgentRank Whitepaper",
      icon: DocumentTextRegular,
      description: "An in-depth analysis of our agent reputation scoring system and its role in maintaining data quality and trust in the Agentic Era.",
      to: "https://github.com/0xIntuition/agent-rank/blob/main/agentrank.md",
    },
    {
      title: "TRUST Token Whitepaper",
      icon: DocumentBulletListRegular,
      description: "Learn about the TRUST token economics, utility, and its role in the Intuition ecosystem.",
      to: "https://github.com/0xIntuition/trust-whitepaper/blob/main/trust-whitepaper.pdf",
    },
  ];
  
  return (
    <div className="whitepapers-section noise-bg relative w-full overflow-hidden">
      <div className="animated-mesh absolute inset-0 opacity-20" />
      
      <section className="relative mx-auto mb-16 md:mb-32 w-full max-w-[90vw] 2xl:max-w-[80vw] flex flex-col p-4 py-0">
        <div className="whitepaper-header flex flex-col items-center justify-between py-8 md:py-14">
          <h2 className="mb-4 font-jakarta text-3xl font-bold text-gray-900 dark:text-white md:text-5xl">Whitepapers</h2>
          <p className="max-w-xl text-center text-gray-600 px-4 dark:text-gray-300 md:px-0">
            Explore our comprehensive whitepapers that detail the technical architecture, security measures, and innovative approaches behind Intuition's knowledge graph.
          </p>
        </div>
        <div className="mx-auto w-full max-w-5xl">
          <div className="whitepaper-grid grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center justify-items-center">
            {papers.map((paper, index) => (
              <WhitepaperCard
                key={paper.title}
                {...paper}
                index={index}
                className="w-full max-w-md"
              />
            ))}
          </div>
        </div>
        <div className="mt-16 flex justify-center">
          <Link
            to="/whitepapers"
            className="explore-btn group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="relative z-10">View All Whitepapers</span>
            <svg
              className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </div>
      </section>
    </div>
  );
} 