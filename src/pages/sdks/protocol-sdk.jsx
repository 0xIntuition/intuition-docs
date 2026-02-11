import React from 'react';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export default function ProtocolSDK() {
  return (
    <Layout
      title="Protocol SDK"
      description="Documentation for the Intuition Protocol SDK - A comprehensive toolkit for interacting with Intuition smart contracts"
    >
      <div className="mx-auto max-w-6xl p-4">
        <h1 className="mb-8 text-4xl font-bold">Protocol SDK</h1>
        
        <p className="mb-6 text-lg text-text-400">
          The Intuition Protocol SDK provides a powerful and intuitive interface for interacting
          with Intuition smart contracts. This package simplifies blockchain interactions by
          offering pre-built methods for reading from and writing to our smart contracts,
          handling wallet connections, and managing transactions.
        </p>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Installation</h2>
        <Tabs>
          <TabItem value="npm" label="npm">
            <CodeBlock language="bash">
              npm install @intuition/protocol-sdk
            </CodeBlock>
          </TabItem>
          <TabItem value="yarn" label="yarn">
            <CodeBlock language="bash">
              yarn add @intuition/protocol-sdk
            </CodeBlock>
          </TabItem>
        </Tabs>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Getting Started</h2>
        <p className="mb-4">
          Initialize the Protocol SDK with your configuration:
        </p>
        <CodeBlock language="javascript">
          {`import { IntuitionProtocol } from '@intuition/protocol-sdk';

const protocol = new IntuitionProtocol({
  network: 'mainnet', // or 'testnet'
  rpcUrl: 'YOUR_RPC_URL', // Optional: defaults to public RPC
  chainId: 1 // Ethereum mainnet
});`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Wallet Connection</h2>
        <p className="mb-4">
          Connect to various wallet providers:
        </p>
        <CodeBlock language="javascript">
          {`// Connect to MetaMask
await protocol.connectWallet('metamask');

// Connect to WalletConnect
await protocol.connectWallet('walletconnect');

// Get connected account
const account = await protocol.getAccount();

// Listen for account changes
protocol.onAccountChange((account) => {
  console.log('Account changed:', account);
});`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Contract Interactions</h2>
        
        <h3 className="mt-6 mb-3 text-xl font-semibold">Reading Contract Data</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <code>getContractState</code> - Get current contract state
          </li>
          <li className="mb-2">
            <code>getUserBalance</code> - Get user's token balance
          </li>
          <li className="mb-2">
            <code>getTransactionHistory</code> - Get historical transactions
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-semibold">Writing to Contracts</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <code>executeTransaction</code> - Send transactions to contracts
          </li>
          <li className="mb-2">
            <code>approveSpending</code> - Approve token spending
          </li>
          <li className="mb-2">
            <code>batchTransactions</code> - Execute multiple transactions in one batch
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Example Usage</h2>
        <p className="mb-4">
          Here are some common contract interaction examples:
        </p>
        <CodeBlock language="javascript">
          {`// Read contract data
const balance = await protocol.getUserBalance({
  tokenAddress: '0x...',
  userAddress: '0x...'
});

// Execute a transaction
const tx = await protocol.executeTransaction({
  contractAddress: '0x...',
  method: 'transfer',
  params: {
    to: '0x...',
    amount: '1000000000000000000' // 1 token in wei
  }
});

// Approve token spending
const approval = await protocol.approveSpending({
  tokenAddress: '0x...',
  spenderAddress: '0x...',
  amount: '1000000000000000000'
});`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Transaction Management</h2>
        <p className="mb-4">
          The SDK provides robust transaction management features:
        </p>
        <CodeBlock language="javascript">
          {`// Get transaction status
const status = await protocol.getTransactionStatus(txHash);

// Wait for transaction confirmation
const receipt = await protocol.waitForTransaction(txHash);

// Estimate gas costs
const gasEstimate = await protocol.estimateGas({
  contractAddress: '0x...',
  method: 'transfer',
  params: {
    to: '0x...',
    amount: '1000000000000000000'
  }
});`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Event Listening</h2>
        <p className="mb-4">
          Listen to contract events:
        </p>
        <CodeBlock language="javascript">
          {`// Subscribe to contract events
const subscription = protocol.subscribeToEvents({
  contractAddress: '0x...',
  eventName: 'Transfer',
  callback: (event) => {
    console.log('Transfer event:', event);
  }
});

// Unsubscribe when done
subscription.unsubscribe();`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Best Practices</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Always check wallet connection status before executing transactions</li>
          <li className="mb-2">Implement proper error handling for failed transactions</li>
          <li className="mb-2">Use gas estimation before sending transactions</li>
          <li className="mb-2">Handle network changes and reconnections gracefully</li>
          <li className="mb-2">Clean up event listeners when components unmount</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Security Considerations</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Never store private keys in your application</li>
          <li className="mb-2">Always verify contract addresses before interactions</li>
          <li className="mb-2">Implement proper input validation for all parameters</li>
          <li className="mb-2">Use the built-in security checks for transaction signing</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Need Help?</h2>
        <p className="mb-4">
          If you need assistance with the Protocol SDK, you can:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Check our <a href="/docs/intuition-smart-contracts" className="text-primary-500 hover:underline">Smart Contract Documentation</a></li>
          <li className="mb-2">Visit our <a href="https://github.com/0xIntuition/intuition-ts/tree/main/packages/sdk" className="text-primary-500 hover:underline">GitHub repository</a></li>
          <li className="mb-2">Join our <a href="/community" className="text-primary-500 hover:underline">Discord community</a></li>
        </ul>
      </div>
    </Layout>
  );
}
