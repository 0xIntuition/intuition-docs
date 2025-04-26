import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { ApolloSandbox } from '@apollo/sandbox/react';
import './ExplorerEmbed.css';

export default function ExplorerEmbed() {
  const isBrowser = useIsBrowser();

  if (!isBrowser) return null;

  return (
    <ApolloSandbox
      initialEndpoint="https://prod.base.intuition-api.com/v1/graphql"
      includeCookies={true}
      initialHeaders={{
        Authorization: `Bearer ${localStorage.token}`
      }}
      className="explorer-container"
    />
  );
}
