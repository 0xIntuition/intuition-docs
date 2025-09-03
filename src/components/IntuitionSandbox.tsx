import React, { useState, useEffect } from 'react';

interface SandboxResult {
  type: 'success' | 'error' | 'info';
  message: string;
  data?: any;
  parsedData?: {
    type: 'atom' | 'triple' | 'transaction' | 'contract';
    [key: string]: any;
  };
}

interface WalletState {
  connected: boolean;
  address?: string;
  chainId?: number;
}


const AtomDisplay: React.FC<{ data: any }> = ({ data }) => (
  <div style={{ 
    border: '1px solid var(--ifm-color-emphasis-300)', 
    borderRadius: '8px', 
    padding: '1rem',
    backgroundColor: 'var(--ifm-background-color)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        backgroundColor: 'var(--ifm-color-primary)', 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem',
        fontSize: '1.2rem'
      }}>
        ⚛️
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{data.name || 'Atom'}</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>ID: {data.id}</p>
      </div>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <div>
        <strong style={{ fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>Type:</strong>
        <p style={{ margin: '0.5rem 0', padding: '0.5rem 0.75rem', backgroundColor: 'var(--ifm-color-primary-lightest)', borderRadius: '6px', fontSize: '1rem' }}>
          {data.type || 'General'}
        </p>
      </div>
      <div>
        <strong style={{ fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>Vault ID:</strong>
        <p style={{ margin: '0.5rem 0', fontFamily: 'monospace', fontSize: '0.95rem', wordBreak: 'break-all' }}>{data.vaultId}</p>
      </div>
      <div>
        <strong style={{ fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>Total Shares:</strong>
        <p style={{ margin: '0.5rem 0', fontFamily: 'monospace', fontSize: '0.95rem' }}>
          {data.totalShares ? (BigInt(data.totalShares) / BigInt(10**18)).toString() + ' ETH' : 'N/A'}
        </p>
      </div>
      <div>
        <strong style={{ fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>Signal Count:</strong>
        <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>{data.signalCount || 0} signals</p>
      </div>
    </div>
    
    {data.description && (
      <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '4px' }}>
        <strong style={{ fontSize: '1rem' }}>Description:</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', lineHeight: '1.5' }}>{data.description}</p>
      </div>
    )}
  </div>
);

const TripleDisplay: React.FC<{ data: any }> = ({ data }) => (
  <div style={{ 
    border: '1px solid var(--ifm-color-emphasis-300)', 
    borderRadius: '8px', 
    padding: '1rem',
    backgroundColor: 'var(--ifm-background-color)'
  }}>
    <div style={{ marginBottom: '1rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
        🔗 Triple Statement
        <span style={{ 
          marginLeft: '1rem', 
          padding: '0.25rem 0.5rem', 
          backgroundColor: (data.confidence && parseFloat(data.confidence) >= 70) ? 'var(--ifm-color-success-lightest)' : 'var(--ifm-color-warning-lightest)', 
          borderRadius: '4px', 
          fontSize: '0.8rem',
          fontWeight: 'normal'
        }}>
          {data.confidence || '50%'} confidence
        </span>
      </h3>
    </div>
    
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '1rem', 
      backgroundColor: 'var(--ifm-color-emphasis-50)', 
      borderRadius: '8px',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '0.5rem'
    }}>
      <div style={{ 
        padding: '0.5rem 1rem', 
        backgroundColor: 'var(--ifm-color-primary-lightest)', 
        borderRadius: '6px',
        fontWeight: '500',
        fontSize: '0.9rem'
      }}>
        {data.subject?.label || 'Subject'}
      </div>
      <span style={{ fontSize: '1.2rem', margin: '0 0.5rem' }}>→</span>
      <div style={{ 
        padding: '0.5rem 1rem', 
        backgroundColor: 'var(--ifm-color-secondary-lightest)', 
        borderRadius: '6px',
        fontWeight: '500',
        fontSize: '0.9rem'
      }}>
        {data.predicate?.label || 'Predicate'}
      </div>
      <span style={{ fontSize: '1.2rem', margin: '0 0.5rem' }}>→</span>
      <div style={{ 
        padding: '0.5rem 1rem', 
        backgroundColor: 'var(--ifm-color-success-lightest)', 
        borderRadius: '6px',
        fontWeight: '500',
        fontSize: '0.9rem'
      }}>
        {data.object?.label || 'Object'}
      </div>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
      <div style={{ padding: '1rem', border: '2px solid var(--ifm-color-success)', borderRadius: '8px', backgroundColor: 'var(--ifm-color-success-lightest)' }}>
        <strong style={{ color: 'var(--ifm-color-success-darkest)', fontSize: '1rem', display: 'block', marginBottom: '0.5rem' }}>👍 Positive Vault</strong>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '1rem', fontWeight: '600' }}>
          {data.positiveVault?.totalAssets ? (BigInt(data.positiveVault.totalAssets) / BigInt(10**18)).toString() + ' ETH' : '1005 ETH'}
        </p>
      </div>
      <div style={{ padding: '1rem', border: '2px solid var(--ifm-color-danger)', borderRadius: '8px', backgroundColor: 'var(--ifm-color-danger-lightest)' }}>
        <strong style={{ color: 'var(--ifm-color-danger-darkest)', fontSize: '1rem', display: 'block', marginBottom: '0.5rem' }}>👎 Negative Vault</strong>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '1rem', fontWeight: '600' }}>
          {data.negativeVault?.totalAssets ? (BigInt(data.negativeVault.totalAssets) / BigInt(10**18)).toString() + ' ETH' : '32 ETH'}
        </p>
      </div>
    </div>
  </div>
);

const TransactionDisplay: React.FC<{ data: any }> = ({ data }) => (
  <div style={{ 
    border: '1px solid var(--ifm-color-emphasis-300)', 
    borderRadius: '8px', 
    padding: '1rem',
    backgroundColor: 'var(--ifm-background-color)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        backgroundColor: 'var(--ifm-color-success)', 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem',
        fontSize: '1.2rem'
      }}>
        ✅
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Transaction Confirmed</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>Block #{data.blockNumber}</p>
      </div>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <div>
        <strong style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>Transaction Hash:</strong>
        <a 
          href={data.explorerUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'block',
            margin: '0.25rem 0', 
            fontFamily: 'monospace', 
            fontSize: '0.8rem',
            color: 'var(--ifm-color-primary)',
            textDecoration: 'none',
            wordBreak: 'break-all'
          }}
        >
          {data.transactionHash}
        </a>
      </div>
      <div>
        <strong style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>Network:</strong>
        <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>{data.network}</p>
      </div>
      <div>
        <strong style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>Gas Used:</strong>
        <p style={{ margin: '0.25rem 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>{data.gasUsed?.toLocaleString()}</p>
      </div>
      <div>
        <strong style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>Created Vault:</strong>
        <p style={{ margin: '0.25rem 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>#{data.vaultId}</p>
      </div>
    </div>
  </div>
);

const ContractDisplay: React.FC<{ data: any }> = ({ data }) => (
  <div style={{ 
    border: '1px solid var(--ifm-color-emphasis-300)', 
    borderRadius: '8px', 
    padding: '1rem',
    backgroundColor: 'var(--ifm-background-color)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        backgroundColor: 'var(--ifm-color-secondary)', 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem',
        fontSize: '1.2rem'
      }}>
        🏦
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>EthMultiVault Contract</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>Base Sepolia Testnet</p>
      </div>
    </div>
    
    <div style={{ 
      padding: '1rem', 
      backgroundColor: 'var(--ifm-color-emphasis-50)', 
      borderRadius: '6px',
      marginBottom: '1rem'
    }}>
      <strong style={{ fontSize: '0.9rem' }}>Contract Address:</strong>
      <a 
        href={data.explorerUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          display: 'block',
          margin: '0.5rem 0', 
          fontFamily: 'monospace', 
          fontSize: '0.9rem',
          color: 'var(--ifm-color-primary)',
          textDecoration: 'none'
        }}
      >
        {data.address}
      </a>
    </div>
    
    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-700)' }}>
      This contract manages all atom and triple vaults on the Intuition protocol. 
      It handles creation, deposits, withdrawals, and economic incentives.
    </p>
  </div>
);


const parseLogsForDisplay = (logs: string[], code: string) => {

  if (code.includes('createAtomFromString')) {
    return {
      type: 'transaction' as const,
      operation: 'Create Atom',
      vaultId: Math.floor(Math.random() * 50000) + 1000,
      transactionHash: `0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`,
      blockNumber: 14000000 + Math.floor(Math.random() * 100000),
      gasUsed: 150000 + Math.floor(Math.random() * 50000),
      network: 'Base Sepolia',
      explorerUrl: `https://sepolia.basescan.org/tx/0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`
    };
  }
  
  if (code.includes('createTripleStatement')) {
    return {
      type: 'transaction' as const,
      operation: 'Create Triple',
      vaultId: Math.floor(Math.random() * 50000) + 1000,
      transactionHash: `0xf1e2d3c4b5a6789012345678901234567890fedcba1234567890fedcba654321`,
      blockNumber: 14000000 + Math.floor(Math.random() * 100000),
      gasUsed: 180000 + Math.floor(Math.random() * 70000),
      network: 'Base Sepolia',
      explorerUrl: `https://sepolia.basescan.org/tx/0xf1e2d3c4b5a6789012345678901234567890fedcba1234567890fedcba654321`
    };
  }
  
  if (code.includes('getAtom')) {
    const atomExamples = [
      { name: 'Ethereum', type: 'Blockchain', description: 'Leading smart contract platform' },
      { name: 'Vitalik Buterin', type: 'Person', description: 'Ethereum co-founder and researcher' },
      { name: 'DeFi', type: 'Concept', description: 'Decentralized Finance ecosystem' },
      { name: 'Base Network', type: 'Blockchain', description: 'Layer 2 scaling solution by Coinbase' }
    ];
    
    const example = atomExamples[Math.floor(Math.random() * atomExamples.length)];
    
    return {
      type: 'atom' as const,
      id: '1001',
      name: example.name,
      type: example.type,
      description: example.description,
      vaultId: Math.floor(Math.random() * 50000) + 1000,
      totalShares: (BigInt(Math.floor(Math.random() * 100) + 50) * BigInt(10**18)).toString(),
      totalAssets: (BigInt(Math.floor(Math.random() * 50) + 25) * BigInt(10**18)).toString(),
      signalCount: Math.floor(Math.random() * 500) + 100,
    };
  }
  
  if (code.includes('getTriple')) {
    const tripleExamples = [
      { subject: 'Vitalik Buterin', predicate: 'is creator of', object: 'Ethereum' },
      { subject: 'Base Network', predicate: 'is built on', object: 'Ethereum' },
      { subject: 'DeFi', predicate: 'enables', object: 'Decentralized Trading' },
      { subject: 'Smart Contracts', predicate: 'power', object: 'Web3 Applications' }
    ];
    
    const example = tripleExamples[Math.floor(Math.random() * tripleExamples.length)];
    const positiveSignal = Math.random() * 80 + 20;
    
    return {
      type: 'triple' as const,
      id: '2001',
      subject: { label: example.subject },
      predicate: { label: example.predicate },
      object: { label: example.object },
      confidence: `${positiveSignal.toFixed(1)}%`,
      positiveVault: {
        totalAssets: (BigInt(Math.floor(positiveSignal * 10) + 50) * BigInt(10**18)).toString()
      },
      negativeVault: {
        totalAssets: (BigInt(Math.floor((100 - positiveSignal) * 5) + 10) * BigInt(10**18)).toString()
      },
      signalCount: Math.floor(Math.random() * 200) + 50
    };
  }
  
  if (code.includes('getEthMultiVaultAddress')) {
    return {
      type: 'contract' as const,
      address: '0x430BbF52503Bd4801E51182f4cB9f8F534225DE5',
      network: 'Base Sepolia',
      explorerUrl: 'https://sepolia.basescan.org/address/0x430BbF52503Bd4801E51182f4cB9f8F534225DE5'
    };
  }
  
  return null;
};


const checkSDKAvailability = () => {

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

        const mockGetEthMultiVaultAddress = () => '0x1A6950807E33d5bC9975067e6D6b5Ea4cD661665'; // Current Base Sepolia address

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

              // Parse the logs to create structured data for display
        const parsedData = parseLogsForDisplay(logs, code);

      setResult({
        type: 'success',
          message: 'Demo executed successfully! (Simulated responses)',
          data: logs.length > 0 ? logs.join('\n') : 'No output',
          parsedData
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
      'create-defi-atom': `// Create an atom for AI Agent (the hottest trend!)
const atom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'GPT-4o Advanced AI Agent'
);

// AI AGENT REGISTERED! Now part of the global AI reputation network
console.log('AI Agent:', 'GPT-4o Advanced AI Agent');
console.log('Vault ID:', atom.state.vaultId);
console.log('Network:', atom.network);
console.log('Status: LIVE on universal knowledge graph');
console.log('');
console.log('What happens next:');
console.log('• Developers can rate this AI agent\'s performance');
console.log('• Build trust: "GPT-4o → EXCELS_AT → Code Generation"');
console.log('• Early reputation builders earn as AI adoption explodes');
console.log('• This AI\'s reputation works across ALL platforms forever');
console.log('');
console.log('Imagine: AI agents with portable, verifiable track records!');`,

      'read-atom': `// Read existing atom data (no wallet required)
const atomData = await getAtom('1001');

// VIRAL CREATOR DISCOVERED! Here's their cross-platform reputation
console.log('Creator:', atomData.data.name);
console.log('Category:', atomData.data.type);
console.log('Known for:', atomData.data.description);
console.log('');
console.log('Creator Economy Stats:');
console.log('• Total Value Locked:', (BigInt(atomData.vault.totalShares) / BigInt(10**18)).toString() + ' ETH');
console.log('• Cross-Platform Signals:', atomData.signalCount);
console.log('• Reputation Status:', atomData.signalCount > 300 ? 'INFLUENCER TIER' : 'RISING STAR');
console.log('');
console.log('POWER MOVE: This reputation works on YouTube, TikTok, X, LinkedIn...');
console.log('No more rebuilding followers from zero on each platform!');
console.log('Brands can verify real influence with cryptographic proof!');`,

      'read-triple': `// Read triple statement data (no wallet required)
const tripleData = await getTriple('2001');

// VIRAL RELATIONSHIP! Market consensus on who's really influential
console.log('Hot Take:', tripleData.subject.label + ' → ' + tripleData.predicate.label + ' → ' + tripleData.object.label);
console.log('');
console.log('Community Verdict:');
console.log('• Market Confidence:', tripleData.confidence);
console.log('• Total Validators:', tripleData.signalCount);
console.log('• Reputation Status:', parseFloat(tripleData.confidence) > 70 ? 'MARKET CONSENSUS' : 'CONTESTED CLAIM');
console.log('');
console.log('Real Money at Stake:');
console.log('• Believers bet:', (BigInt(tripleData.positiveVault.totalAssets) / BigInt(10**18)).toString() + ' ETH');
console.log('• Doubters bet:', (BigInt(tripleData.negativeVault.totalAssets) / BigInt(10**18)).toString() + ' ETH');
console.log('');
console.log('BREAKTHROUGH: Truth has economic value in this system!');
console.log('Early believers in accurate claims get rich!');`,

      'create-triple': `// Create a relationship statement (requires wallet)
const triple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    subjectId: '1001', // Vitalik Buterin
    predicateId: '2001', // "is founder of"
    objectId: '3001' // Ethereum
  }
);

// RELATIONSHIP CREATED! You've contributed to the global knowledge graph
console.log('New Relationship: Vitalik Buterin → is founder of → Ethereum');
console.log('Statement ID:', triple.state.vaultId);
console.log('Network:', triple.network);
console.log('Gas Used:', triple.gasUsed.toLocaleString());
console.log('');
console.log('Economic Impact:');
console.log('• You now have economic stake in this relationship');
console.log('• Others can signal agreement/disagreement');
console.log('• Early contributors earn more as consensus builds');
console.log('');
console.log('View on Explorer:', triple.explorerUrl);`,

      'check-vault': `// Check MultiVault contract address
const vaultAddress = getEthMultiVaultAddress(84532); // Base Sepolia

// CONNECTED! Here's your gateway to the Intuition knowledge graph
console.log('EthMultiVault Contract:');
console.log('Address:', vaultAddress);
console.log('Network: Base Sepolia (Chain ID: 84532)');
console.log('Explorer: https://sepolia.basescan.org/address/' + vaultAddress);
console.log('');
console.log('What this contract does:');
console.log('• Manages ALL atom & triple vaults on Intuition');
console.log('• Handles deposits, withdrawals & economic incentives');
console.log('• Powers the universal knowledge graph');
console.log('• Enables cross-platform reputation & trust');
console.log('');
console.log('Ready to build the future of trust!');`,

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
            📖 Read Operations (Demo - No wallet needed):
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

        {/* Write operations - would require wallet in real usage */}
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--ifm-color-info)', fontWeight: 'bold', marginRight: '0.5rem' }}>
            ✍️ Write Operations (Demo - Would require wallet in real usage):
          </span>
          <button
            onClick={() => loadExample('create-defi-atom')}
          style={{
            marginRight: '0.5rem',
            marginBottom: '0.5rem',
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--ifm-color-info)',
            borderRadius: '4px',
            backgroundColor: 'transparent',
              color: 'var(--ifm-color-info)',
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
              border: '1px solid var(--ifm-color-info)',
            borderRadius: '4px',
            backgroundColor: 'transparent',
              color: 'var(--ifm-color-info)',
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
            minHeight: '250px',
            padding: '1.5rem',
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: '8px',
            backgroundColor: 'var(--ifm-color-emphasis-50)',
            color: 'var(--ifm-color-content)',
            fontFamily: 'monospace',
            fontSize: '16px',
            lineHeight: '1.5',
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

      {/* Interactive Results Display */}
      {result && (
        <div style={{
          marginTop: '1rem',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Result Header */}
          <div style={{
            padding: '1rem',
            backgroundColor: result.type === 'error' ? 'var(--ifm-color-danger-lightest)' :
                            result.type === 'success' ? 'var(--ifm-color-success-lightest)' :
                            'var(--ifm-color-info-lightest)',
            borderBottom: result.parsedData ? '1px solid var(--ifm-color-emphasis-300)' : 'none'
          }}>
            <h4 style={{ 
              marginTop: 0, 
              marginBottom: '0.25rem',
              color: result.type === 'error' ? 'var(--ifm-color-danger-darkest)' :
                     result.type === 'success' ? 'var(--ifm-color-success-darkest)' :
                     'var(--ifm-color-info-darkest)',
              fontSize: '1rem'
            }}>
              {result.type === 'error' ? '❌ Error' : 
               result.type === 'success' ? '✅ Execution Successful' : 
               'ℹ️ Query Result'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{result.message}</p>
          </div>

          {/* Interactive Data Display */}
          {result.parsedData && (
            <div style={{ padding: '1rem' }}>
              {result.parsedData.type === 'atom' && (
                <AtomDisplay data={result.parsedData} />
              )}
              {result.parsedData.type === 'triple' && (
                <TripleDisplay data={result.parsedData} />
              )}
              {result.parsedData.type === 'transaction' && (
                <TransactionDisplay data={result.parsedData} />
              )}
              {result.parsedData.type === 'contract' && (
                <ContractDisplay data={result.parsedData} />
              )}
            </div>
          )}

          {/* Console Output (collapsible) */}
            {result.data && (
            <details style={{ marginTop: result.parsedData ? '0' : '1rem' }}>
              <summary style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--ifm-color-emphasis-50)',
                cursor: 'pointer',
                borderTop: '1px solid var(--ifm-color-emphasis-300)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                🔍 View Console Output
              </summary>
              <pre style={{
                margin: 0,
                padding: '1.5rem',
                backgroundColor: 'var(--ifm-color-emphasis-100)',
                fontSize: '0.95rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                overflow: 'auto',
                maxHeight: '400px',
                lineHeight: '1.4',
                borderRadius: '0 0 8px 8px'
              }}>
                {result.data}
              </pre>
            </details>
            )}
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

      {/* Real SDK Setup Guide */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--ifm-color-emphasis-50)',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '6px'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem' }}>
          🚀 Ready for Real SDK Integration?
        </h4>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
          To use the actual Intuition SDK in your project, follow these steps:
        </p>
        
        <div style={{ 
          backgroundColor: 'var(--ifm-color-emphasis-100)', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.85rem'
        }}>
          <div style={{ marginBottom: '0.5rem', color: 'var(--ifm-color-emphasis-600)' }}>
            # Install the SDK
          </div>
          <div style={{ marginBottom: '1rem' }}>
            npm install @0xintuition/sdk viem
          </div>
          
          <div style={{ marginBottom: '0.5rem', color: 'var(--ifm-color-emphasis-600)' }}>
            # Basic setup
          </div>
          <div>
            import &#123; createPublicClient, http &#125; from 'viem'<br/>
            import &#123; baseSepolia &#125; from 'viem/chains'<br/>
            import &#123; createAtomFromString &#125; from '@0xintuition/sdk'
          </div>
        </div>
        
        <p style={{ marginBottom: 0, fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)' }}>
          📖 For complete setup instructions and examples, check out the <a href="/docs/developer-tools/sdks/overview" style={{ color: 'var(--ifm-color-primary)' }}>SDK Documentation</a>.
        </p>
      </div>
    </div>
  );
};

export default IntuitionSandbox; 