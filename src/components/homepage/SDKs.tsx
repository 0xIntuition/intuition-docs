import React from 'react';
import Link from '@docusaurus/Link';

function SDK({ icon, to, name }: { icon: string; name: string; to?: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center rounded-lg border border-secondary-700 p-4 text-inherit hover:border-primary hover:text-primary hover:no-underline"
    >
      <img src={icon} className="mb-3 h-12 w-12" alt={`${name} icon`} />
      <span className="font-medium text-center">{name}</span>
    </Link>
  );
}

export default function SDKs() {
  return (
    <div className="mx-auto mb-32 flex w-full max-w-5xl flex-col items-center text-center p-4 py-0">
      <span className="mb-2 uppercase tracking-wider text-text-400">
        SDK Documentation
      </span>

      <h3 className="mb-12 text-4xl">
        Tap into the Intuition hive mind.
      </h3>

      <div className="mb-10">
        <h4 className="mb-2 text-2xl">Packages</h4>

        <p className="mb-6 text-text-400">
          Build faster with our prebuilt components, queries, and more.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 place-items-center justify-center mx-auto max-w-4xl">
          <SDK
            name="Protocol Package"
            to="/protocol-package"
            icon="/static/landing-page/sdk-icons/react.png"
          />
          <SDK
            name="GraphQL Package"
            to="/graphql-package"
            icon="/static/landing-page/sdk-icons/react.png"
          />
          <SDK
            name="1UI"
            to="/1ui"
            icon="/static/landing-page/sdk-icons/react.png"
          />
        </div>
      </div>
    </div>
  );
}
