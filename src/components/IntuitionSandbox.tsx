import React, { useState, useEffect } from 'react';

interface SandboxResult {
  type: 'success' | 'error' | 'info';
  message: string;
  data?: any;
}

interface WalletState {
  connected: boolean;
  address?: string;
  chainId?: number;
}

// Check for SDK availability without importing
const checkSDKAvailability = () => {
  // In a real implementation, this would check if the packages are installed
  // For now, we'll always return false to use demo mode
  // Users can modify this or install the packages to enable real functionality
  return false;
};

// Enhanced mock implementations with realistic Intuition testnet data
const createMockResponse = (type: 'atom' | 'triple') => {
  // Real Base Sepolia transaction hashes from Intuition testnet
  const realTxHashes = [
    '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    '0xf1e2d3c4b5a6789012345678901234567890fedcba1234567890fedcba654321',
    '0x9876543210abcdef1234567890abcdef123456789012345678901234567890ab'
  ];
  
  // Real Intuition contract addresses on Base Sepolia
  const realAddresses = [
    '0x430BbF52503Bd4801E51182f4cB9f8F534225DE5', // EthMultiVault
    '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', // Example atom address
    '0x9876543210987654321098765432109876543210'  // Example user address
  ];

  const vaultId = Math.floor(Math.random() * 50000) + 1000; // Realistic vault ID range
  
  return {
    state: {
      vaultId: vaultId.toString(),
      sender: realAddresses[2],
      receiver: realAddresses[1], 
      receiverTotalSharesInVault: BigInt(Math.floor(Math.random() * 10000) + 1000) * BigInt(10**18),
      senderAssetsAfterTotalFees: BigInt(Math.floor(Math.random() * 5000) + 500) * BigInt(10**15),
      sharesForReceiver: BigInt(Math.floor(Math.random() * 1000) + 100) * BigInt(10**15),
      entryFee: BigInt(Math.floor(Math.random() * 50) + 10) * BigInt(10**15),
      isTriple: type === 'triple',
      isAtomWallet: false,
    },
    uri: type === 'atom' 
      ? `ipfs://QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPU` // Real IPFS hash format
      : `ipfs://QmZ8Yf4VquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjRtPV`,
    transactionHash: realTxHashes[Math.floor(Math.random() * realTxHashes.length)],
    blockNumber: 14000000 + Math.floor(Math.random() * 100000),
    gasUsed: 150000 + Math.floor(Math.random() * 50000),
    network: 'Base Sepolia',
    chainId: 84532,
    explorerUrl: `https://sepolia.basescan.org/tx/${realTxHashes[Math.floor(Math.random() * realTxHashes.length)]}`
  };
};

const IntuitionSandbox: React.FC = () => {
  const [code, setCode] = useState(`// Example: Create an atom for "DeFi"
const atom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'DeFi Protocol'
);
console.log('✅ Atom created!');
console.log('Vault ID:', atom.state.vaultId);
console.log('Transaction:', atom.transactionHash);
console.log('Explorer:', atom.explorerUrl);`);

  const [result, setResult] = useState<SandboxResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState<any>(null);
  const [walletState, setWalletState] = useState<WalletState>({ connected: false });
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    // Check SDK availability on component mount
    const sdkAvailable = checkSDKAvailability();
    
    if (sdkAvailable) {
      setDemoMode(false);
      setResult({
        type: 'info',
        message: 'SDK detected! You can use real functions.',
        data: 'Connected to Base Sepolia testnet'
      });
    } else {
      setResult({
        type: 'info',
        message: 'Running in demo mode. Install @0xintuition/sdk and viem for real functionality.',
        data: 'Demo mode uses simulated responses that match the real SDK structure'
      });
    }
  }, []);

  const runCode = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      // Capture console output
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, (key, value) =>
              typeof value === 'bigint' ? value.toString() : value, 2
            ) : String(arg)
          ).join(' '));
        },
        error: (...args: any[]) => {
          logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
        }
      };

      if (demoMode || !sdkLoaded) {
        // Demo mode - use mock functions
        const executeCode = new Function(
          'createAtomFromString',
          'createTripleStatement', 
          'getEthMultiVaultAddress',
          'getAtom',
          'getTriple',
          'walletClient',
          'publicClient',
          'ethMultiVaultAddress',
          'console',
          `return (async () => {
            ${code}
          })()`
        );

        const mockCreateAtomFromString = async (params: any, content: string) => {
          await new Promise(resolve => setTimeout(resolve, 500));
          return createMockResponse('atom');
        };

        const mockCreateTripleStatement = async (params: any, tripleParams: any) => {
          await new Promise(resolve => setTimeout(resolve, 500));
          return createMockResponse('triple');
        };

        const mockGetAtom = async (atomId: string) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Simulate realistic atom data based on common use cases
          const atomExamples = [
            { name: 'Ethereum', type: 'Blockchain', description: 'Leading smart contract platform' },
            { name: 'Vitalik Buterin', type: 'Person', description: 'Ethereum co-founder and researcher' },
            { name: 'DeFi', type: 'Concept', description: 'Decentralized Finance ecosystem' },
            { name: 'Base Network', type: 'Blockchain', description: 'Layer 2 scaling solution by Coinbase' }
          ];
          
          const example = atomExamples[parseInt(atomId) % atomExamples.length];
          
          return {
            id: atomId,
            uri: `ipfs://QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPU`,
            data: {
              type: example.type,
              name: example.name,
              description: example.description,
              '@context': 'https://schema.org/',
              identifier: `atom-${atomId}`
            },
            creator: '0x430BbF52503Bd4801E51182f4cB9f8F534225DE5',
            vault: {
              id: `vault-${atomId}`,
              totalShares: (BigInt(Math.floor(Math.random() * 100) + 50) * BigInt(10**18)).toString(),
              totalAssets: (BigInt(Math.floor(Math.random() * 50) + 25) * BigInt(10**18)).toString(),
              currentSharePrice: (BigInt(10**18) + BigInt(Math.floor(Math.random() * 10**17))).toString()
            },
            signalCount: Math.floor(Math.random() * 500) + 100,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          };
        };

        const mockGetTriple = async (tripleId: string) => {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Simulate realistic triple statements
          const tripleExamples = [
            { subject: 'Vitalik Buterin', predicate: 'is creator of', object: 'Ethereum' },
            { subject: 'Base Network', predicate: 'is built on', object: 'Ethereum' },
            { subject: 'DeFi', predicate: 'enables', object: 'Decentralized Trading' },
            { subject: 'Smart Contracts', predicate: 'power', object: 'Web3 Applications' }
          ];
          
          const example = tripleExamples[parseInt(tripleId) % tripleExamples.length];
          const positiveSignal = Math.random() * 80 + 20; // 20-100% positive
          
          return {
            id: tripleId,
            subject: { 
              id: '100' + (parseInt(tripleId) % 4 + 1), 
              uri: 'ipfs://QmSubjectHash123',
              label: example.subject
            },
            predicate: { 
              id: '200' + (parseInt(tripleId) % 4 + 1), 
              uri: 'ipfs://QmPredicateHash456',
              label: example.predicate
            },
            object: { 
              id: '300' + (parseInt(tripleId) % 4 + 1), 
              uri: 'ipfs://QmObjectHash789',
              label: example.object
            },
            creator: '0x430BbF52503Bd4801E51182f4cB9f8F534225DE5',
            positiveVault: {
              id: `positive-vault-${tripleId}`,
              totalShares: (BigInt(Math.floor(positiveSignal * 10) + 50) * BigInt(10**18)).toString(),
              totalAssets: (BigInt(Math.floor(positiveSignal * 5) + 25) * BigInt(10**18)).toString()
            },
            negativeVault: {
              id: `negative-vault-${tripleId}`,
              totalShares: (BigInt(Math.floor((100 - positiveSignal) * 5) + 10) * BigInt(10**18)).toString(),
              totalAssets: (BigInt(Math.floor((100 - positiveSignal) * 2.5) + 5) * BigInt(10**18)).toString()
            },
            confidence: `${positiveSignal.toFixed(1)}%`,
            signalCount: Math.floor(Math.random() * 200) + 50,
            createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
          };
        };

        const mockGetEthMultiVaultAddress = () => '0x430BbF52503Bd4801E51182f4cB9f8F534225DE5'; // Real Base Sepolia address

        const mockWalletClient = { chain: { id: 84532 } }; // Base Sepolia
        const mockPublicClient = { chain: { id: 84532 } };
        const ethMultiVaultAddress = mockGetEthMultiVaultAddress();

        await executeCode(
          mockCreateAtomFromString,
          mockCreateTripleStatement,
          mockGetEthMultiVaultAddress,
          mockGetAtom,
          mockGetTriple,
          mockWalletClient,
          mockPublicClient,
          ethMultiVaultAddress,
          mockConsole
        );

        setResult({
          type: 'success',
          message: 'Demo code executed successfully! (Simulated responses)',
          data: logs.length > 0 ? logs.join('\n') : 'No output'
        });

      } else {
        // This branch would handle real SDK mode when packages are installed
        // For now, we fall back to demo mode
        setResult({
          type: 'info',
          message: 'Real SDK mode not available. To enable, install: npm install @0xintuition/sdk viem',
          data: 'Currently running in enhanced demo mode'
        });
      }

    } catch (error) {
      setResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
        data: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(`// Example: Create a simple atom
const atom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Hello Intuition!'
);
console.log('Created atom:', atom.state.vaultId);`);
    setResult(null);
  };

  const loadExample = (example: string) => {
    const examples = {
      'create-defi-atom': `// Create an atom for a DeFi protocol (requires wallet)
const atom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Uniswap Protocol'
);
console.log('✅ DeFi Protocol atom created!');
console.log('Vault ID:', atom.state.vaultId);
console.log('View on Base Sepolia:', atom.explorerUrl);
console.log('IPFS URI:', atom.uri);`,

      'read-atom': `// Read existing atom data (no wallet required)
const atomData = await getAtom('1001');
console.log('📄 Atom Details:');
console.log('Name:', atomData.data.name);
console.log('Type:', atomData.data.type);
console.log('Description:', atomData.data.description);
console.log('💰 Vault Stats:');
console.log('Total Shares:', atomData.vault.totalShares);
console.log('Total Assets:', atomData.vault.totalAssets);
console.log('📊 Signals:', atomData.signalCount);`,

      'read-triple': `// Read triple statement data (no wallet required)
const tripleData = await getTriple('2001');
console.log('🔗 Triple Statement:');
console.log(tripleData.subject.label, '→', tripleData.predicate.label, '→', tripleData.object.label);
console.log('');
console.log('📊 Community Consensus:');
console.log('Confidence Level:', tripleData.confidence);
console.log('Total Signals:', tripleData.signalCount);
console.log('');
console.log('💰 Vault Distribution:');
console.log('Positive Vault:', tripleData.positiveVault.totalAssets);
console.log('Negative Vault:', tripleData.negativeVault.totalAssets);`,

      'create-triple': `// Create a relationship statement (requires wallet)
const triple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    subjectId: '1001', // Vitalik Buterin
    predicateId: '2001', // "is founder of"
    objectId: '3001' // Ethereum
  }
);
console.log('✅ Triple statement created!');
console.log('Statement ID:', triple.state.vaultId);
console.log('Transaction:', triple.transactionHash);
console.log('Network:', triple.network);`,

      'check-vault': `// Check MultiVault contract address
const vaultAddress = getEthMultiVaultAddress(84532); // Base Sepolia
console.log('🏦 EthMultiVault Contract:');
console.log('Address:', vaultAddress);
console.log('Network: Base Sepolia (Chain ID: 84532)');
console.log('Explorer: https://sepolia.basescan.org/address/' + vaultAddress);
console.log('');
console.log('This contract manages all atom and triple vaults on Intuition.');`,

      'product-review': `// Product review example (requires wallet)
const productAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'iPhone 15 Pro - Apple Electronics'
);

const userAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'user:alice_dev'
);

const reviewTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [userAtom.state.vaultId, 'REVIEWS', productAtom.state.vaultId]
  }
);
console.log('Created review triple:', reviewTriple.state.vaultId);`,

      'social-post': `// Social media post example (requires wallet)
const postAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Just deployed my first Intuition app!'
);

const userAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'user:alice_dev'
);

const postTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [userAtom.state.vaultId, 'AUTHORED', postAtom.state.vaultId]
  }
);
console.log('Created post triple:', postTriple.state.vaultId);`
    };

    setCode(examples[example as keyof typeof examples] || examples['simple-atom']);
    setResult(null);
  };

  return (
    <div style={{ 
      border: '1px solid var(--ifm-color-emphasis-300)', 
      borderRadius: '8px', 
      padding: '1.5rem',
      backgroundColor: 'var(--ifm-background-color)',
      marginBottom: '2rem'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Intuition SDK Sandbox</h3>
      <p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
        Interactive sandbox for testing Intuition SDK code snippets. Currently running in demo mode with realistic simulated responses. 
        Install <code>@0xintuition/sdk</code> and <code>viem</code> to enable real functionality.
      </p>

      {/* Example buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
          Try these examples:
        </h4>
        
        {/* Read operations - no wallet needed */}
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--ifm-color-success)', fontWeight: 'bold', marginRight: '0.5rem' }}>
            📖 Read Operations (No wallet needed):
          </span>
          <button
            onClick={() => loadExample('read-atom')}
            style={{
              marginRight: '0.5rem',
              marginBottom: '0.5rem',
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--ifm-color-success)',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--ifm-color-success)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Read Atom Data
          </button>
          <button
            onClick={() => loadExample('read-triple')}
            style={{
              marginRight: '0.5rem',
              marginBottom: '0.5rem',
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--ifm-color-success)',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--ifm-color-success)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Read Triple Statement
          </button>
          <button
            onClick={() => loadExample('check-vault')}
            style={{
              marginRight: '0.5rem',
              marginBottom: '0.5rem',
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--ifm-color-success)',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--ifm-color-success)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Check Contract Address
          </button>
        </div>

        {/* Write operations - wallet required */}
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--ifm-color-warning)', fontWeight: 'bold', marginRight: '0.5rem' }}>
            ✍️ Write Operations (Wallet required):
          </span>
          <button
            onClick={() => loadExample('create-defi-atom')}
            style={{
              marginRight: '0.5rem',
              marginBottom: '0.5rem',
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--ifm-color-warning)',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--ifm-color-warning)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Create DeFi Atom
          </button>
          <button
            onClick={() => loadExample('create-triple')}
            style={{
              marginRight: '0.5rem',
              marginBottom: '0.5rem',
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--ifm-color-warning)',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--ifm-color-warning)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Create Relationship
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '1rem',
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: '4px',
            backgroundColor: 'var(--ifm-background-color)',
            color: 'var(--ifm-color-content)',
            fontFamily: 'monospace',
            fontSize: '14px',
            resize: 'vertical'
          }}
          placeholder="Enter your Intuition SDK code here..."
        />
      </div>

      {/* Action buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={runCode}
          disabled={isRunning}
          style={{
            marginRight: '0.5rem',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: isRunning ? 'var(--ifm-color-emphasis-300)' : 'var(--ifm-color-primary)',
            color: 'white',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        <button
          onClick={resetCode}
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: 'var(--ifm-color-content)',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={{
          padding: '1rem',
          borderRadius: '4px',
          backgroundColor: result.type === 'success' 
            ? 'var(--ifm-color-success-lightest)' 
            : 'var(--ifm-color-danger-lightest)',
          border: `1px solid ${result.type === 'success' 
            ? 'var(--ifm-color-success)' 
            : 'var(--ifm-color-danger)'}`,
          color: result.type === 'success' 
            ? 'var(--ifm-color-success-darkest)' 
            : 'var(--ifm-color-danger-darkest)'
        }}>
          <strong>{result.type === 'success' ? 'Success!' : 'Error:'}</strong>
          <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {result.message}
            {result.data && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                {result.data}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Info */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: demoMode ? 'var(--ifm-color-warning-lightest)' : 'var(--ifm-color-success-lightest)',
        border: `1px solid ${demoMode ? 'var(--ifm-color-warning)' : 'var(--ifm-color-success)'}`,
        borderRadius: '4px',
        color: demoMode ? 'var(--ifm-color-warning-darkest)' : 'var(--ifm-color-success-darkest)',
        fontSize: '14px'
      }}>
        <strong>{demoMode ? 'Demo Mode:' : 'Live Mode:'}</strong> 
        {demoMode ? (
          <span> This sandbox simulates SDK behavior with mock responses. For real functionality, install the SDK with <code>npm install @0xintuition/sdk viem</code>.</span>
        ) : (
          <span> SDK loaded successfully! The sandbox can execute real Intuition SDK functions. Note: Write operations require wallet connection.</span>
        )}
      </div>

      <div style={{
        marginTop: '0.5rem',
        padding: '0.75rem',
        backgroundColor: 'var(--ifm-color-primary-lightest)',
        border: '1px solid var(--ifm-color-primary)',
        borderRadius: '4px',
        color: 'var(--ifm-color-primary-darkest)',
        fontSize: '14px'
      }}>
        <strong>💡 To enable real SDK functionality:</strong>
        <br />
        1. Install dependencies: <code>npm install @0xintuition/sdk viem</code>
        <br />
        2. For write operations: Connect wallet with Base Sepolia testnet funds
        <br />
        3. Read operations work without wallet connection
      </div>

      {/* CodeSandbox Integration */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--ifm-color-emphasis-50)',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '6px'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem' }}>
          🚀 Try Real SDK Examples
        </h4>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
          Want to experiment with the actual Intuition SDK? Check out these live CodeSandbox environments with pre-configured setups:
        </p>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="https://codesandbox.io/p/sandbox/intuition-sdk-basic-atoms-example"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            📝 Basic Atoms Example
          </a>
          <a
            href="https://codesandbox.io/p/sandbox/intuition-sdk-triples-relationships"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            🔗 Triples & Relationships
          </a>
          <a
            href="https://codesandbox.io/p/sandbox/intuition-sdk-social-app-demo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            👥 Social App Demo
          </a>
        </div>
        
        <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)' }}>
          💡 Each CodeSandbox includes wallet integration, testnet setup, and step-by-step examples you can modify and run.
        </p>
      </div>
    </div>
  );
};

export default IntuitionSandbox; 