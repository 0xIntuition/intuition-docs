import React from 'react';
import { ApolloSandbox } from '@apollo/sandbox/react';
import './ExplorerEmbed.css';

export default function ExplorerEmbed() {
  if (typeof window === 'undefined') return null;

  return (
    <ApolloSandbox
      initialEndpoint="https://testnet.intuition.sh/v1/graphql"
      includeCookies={true}
      className="explorer-container"
    />
  );
}
