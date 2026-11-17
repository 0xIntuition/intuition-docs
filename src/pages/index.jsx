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
            graph and developer tools.
          </p>

          <nav aria-label="Documentation areas">
            <h2>Explore the documentation</h2>
            <ul>
              <li>
                <a href="/docs/agents">Build with AI agents</a>
              </li>
              <li>
                <a href="/docs/concepts">Explore the concepts</a>
              </li>
              <li>
                <a href="/docs/examples">Browse worked examples</a>
              </li>
              <li>
                <a href="/docs/community">Community and support</a>
              </li>
              <li>
                <a href="/docs/v1">V1 documentation</a>
              </li>
            </ul>
          </nav>

          <section aria-labelledby="llm-documentation">
            <h2 id="llm-documentation">Documentation for language models</h2>
            <ul>
              <li>
                <a href="/llms.txt">llms.txt</a> — a concise index of the V2
                documentation.
              </li>
              <li>
                <a href="/llms-full.txt">llms-full.txt</a> — the complete V2
                documentation in an LLM-friendly format.
              </li>
              <li>
                <a href="/docs/v1/llms.txt">V1 llms.txt</a> — an index of the V1
                documentation.
              </li>
            </ul>
          </section>
        </main>
      </noscript>
    </>
  );
}
