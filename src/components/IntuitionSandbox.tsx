import React, { useState } from 'react';

interface SandboxResult {
  type: 'success' | 'error';
  message: string;
  data?: any;
}

// Mock SDK functions for demonstration
const mockCreateAtomFromString = async (params: any, content: string) => {
  const mockAtom = {
    state: {
      vaultId: Math.floor(Math.random() * 1000000).toString(),
      sender: '0x1234567890123456789012345678901234567890',
      receiver: '0x1234567890123456789012345678901234567890',
      receiverTotalSharesInVault: BigInt(1000),
      senderAssetsAfterTotalFees: BigInt(950),
      sharesForReceiver: BigInt(50),
      entryFee: BigInt(10),
      isTriple: false,
      isAtomWallet: false,
    },
    uri: `ipfs://mock-${Date.now()}`,
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockAtom;
};

const mockCreateTripleStatement = async (params: any, tripleParams: any) => {
  const mockTriple = {
    state: {
      vaultId: Math.floor(Math.random() * 1000000).toString(),
      sender: '0x1234567890123456789012345678901234567890',
      receiver: '0x1234567890123456789012345678901234567890',
      receiverTotalSharesInVault: BigInt(1000),
      senderAssetsAfterTotalFees: BigInt(950),
      sharesForReceiver: BigInt(50),
      entryFee: BigInt(10),
      isTriple: true,
      isAtomWallet: false,
    },
    uri: `ipfs://mock-triple-${Date.now()}`,
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockTriple;
};

const mockGetEthMultiVaultAddress = (chainId: number) => {
  return '0x1234567890123456789012345678901234567890';
};

// Mock viem clients
const mockWalletClient = {
  chain: { id: 8453 }, // Base mainnet
  account: '0x1234567890123456789012345678901234567890',
};

const mockPublicClient = {
  chain: { id: 8453 },
};

const IntuitionSandbox: React.FC = () => {
  const [code, setCode] = useState(`// Example: Create a simple atom
const atom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Hello Intuition!'
);
console.log('Created atom:', atom.state.vaultId);`);

  const [result, setResult] = useState<SandboxResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const ethMultiVaultAddress = mockGetEthMultiVaultAddress(mockWalletClient.chain.id);

  const runCode = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      // Create a safe execution environment with mock functions
      const executeCode = new Function(
        'createAtomFromString',
        'createTripleStatement',
        'getEthMultiVaultAddress',
        'walletClient',
        'publicClient',
        'ethMultiVaultAddress',
        'console',
        code
      );

      // Capture console output
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
        },
        error: (...args: any[]) => {
          logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
        }
      };

      // Execute the code with mock functions
      await executeCode(
        mockCreateAtomFromString,
        mockCreateTripleStatement,
        mockGetEthMultiVaultAddress,
        mockWalletClient,
        mockPublicClient,
        ethMultiVaultAddress,
        mockConsole
      );

      setResult({
        type: 'success',
        message: 'Code executed successfully! (Mock environment)',
        data: logs.length > 0 ? logs.join('\n') : 'No output'
      });

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
      'simple-atom': `// Create a simple atom
const atom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Hello Intuition!'
);
console.log('Created atom:', atom.state.vaultId);`,

      'product-review': `// Product review example
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

      'social-post': `// Social media post example
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
        Test Intuition SDK code snippets in a mock environment. This sandbox simulates the SDK behavior without requiring actual blockchain transactions.
      </p>

      {/* Example buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => loadExample('simple-atom')}
          style={{
            marginRight: '0.5rem',
            marginBottom: '0.5rem',
            padding: '0.5rem 1rem',
            border: '1px solid var(--ifm-color-primary)',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: 'var(--ifm-color-primary)',
            cursor: 'pointer'
          }}
        >
          Simple Atom
        </button>
        <button
          onClick={() => loadExample('product-review')}
          style={{
            marginRight: '0.5rem',
            marginBottom: '0.5rem',
            padding: '0.5rem 1rem',
            border: '1px solid var(--ifm-color-primary)',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: 'var(--ifm-color-primary)',
            cursor: 'pointer'
          }}
        >
          Product Review
        </button>
        <button
          onClick={() => loadExample('social-post')}
          style={{
            marginRight: '0.5rem',
            marginBottom: '0.5rem',
            padding: '0.5rem 1rem',
            border: '1px solid var(--ifm-color-primary)',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: 'var(--ifm-color-primary)',
            cursor: 'pointer'
          }}
        >
          Social Post
        </button>
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

      {/* Info */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: 'var(--ifm-color-info-lightest)',
        border: '1px solid var(--ifm-color-info)',
        borderRadius: '4px',
        color: 'var(--ifm-color-info-darkest)',
        fontSize: '14px'
      }}>
        <strong>Note:</strong> This is a mock sandbox that simulates the Intuition SDK behavior. 
        It generates mock responses to help you understand the API structure. For real development, 
        install the actual SDK with <code>npm install @0xintuition/sdk viem</code>.
      </div>
    </div>
  );
};

export default IntuitionSandbox; 