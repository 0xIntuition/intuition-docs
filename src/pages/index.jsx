import { Redirect } from '@docusaurus/router';

export default function Home() {
  return (
    <>
      <Redirect to="/docs" />
      <noscript>
        <main>
          <h1>Intuition Documentation</h1>
          <p>
            Learn how to build with Intuition&apos;s decentralized knowledge
            graph, protocol, APIs, and developer tools.
          </p>

          <nav aria-label="Documentation areas">
            <h2>Explore the documentation</h2>
            <ul>
              <li>
                <a href="/docs/getting-started/overview">Getting Started</a>
              </li>
              <li>
                <a href="/docs/quick-start/using-the-sdk">Quick Start</a>
              </li>
              <li>
                <a href="/docs/intuition-concepts/primitives">Concepts</a>
              </li>
              <li>
                <a href="/docs/intuition-sdk/installation-and-setup">SDK</a>
              </li>
              <li>
                <a href="/docs/graphql-api/overview">GraphQL API</a>
              </li>
              <li>
                <a href="/docs/protocol/getting-started/overview">Protocol</a>
              </li>
              <li>
                <a href="/docs/intuition-smart-contracts">Contracts</a>
              </li>
              <li>
                <a href="/docs/intuition-network">Network</a>
              </li>
              <li>
                <a href="/docs/tutorials/overview">Tutorials</a>
              </li>
            </ul>
          </nav>

          <section aria-labelledby="llm-documentation">
            <h2 id="llm-documentation">Documentation for language models</h2>
            <ul>
              <li>
                <a href="/llms.txt">llms.txt</a> — a concise index of the
                documentation.
              </li>
              <li>
                <a href="/llms-medium.txt">llms-medium.txt</a> — condensed
                summaries of every page, a fraction of the size of the full
                corpus.
              </li>
              <li>
                <a href="/llms-full.txt">llms-full.txt</a> — the complete
                documentation corpus in an LLM-friendly format.
              </li>
            </ul>
          </section>
        </main>
      </noscript>
    </>
  );
}
