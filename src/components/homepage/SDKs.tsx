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
    <div className="py-20 mx-auto w-full max-w-7xl px-4">
      <div className="flex flex-col items-center text-center">
        <span className="mb-3 uppercase tracking-wider text-text-400">
          SDK Documentation
        </span>

        <h3 className="mb-8 text-4xl lg:text-5xl font-bold">
          Tap into the Intuition hive mind.
        </h3>

        <div className="w-full max-w-4xl">
          <h4 className="mb-3 text-2xl font-semibold">Packages</h4>

          <p className="mb-8 text-lg text-text-400">
            Build faster with our prebuilt components, queries, and more.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 place-items-center justify-center">
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
              to="/sdks/1ui"
              icon="/static/landing-page/sdk-icons/react.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
