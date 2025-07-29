import React, { useState } from 'react';
import clsx from 'clsx';

interface BondingCurveDemoProps {
  className?: string;
}

export default function BondingCurveDemo({ className }: BondingCurveDemoProps) {
  const [supply, setSupply] = useState(100);
  const [curveType, setCurveType] = useState<'linear' | 'offset-progressive'>('linear');
  const [amount, setAmount] = useState(10);

  // LinearCurve contract math implementation
  const convertToShares = (assets: number, totalAssets: number, totalShares: number): number => {
    if (totalShares === 0) {
      return assets; // 1:1 initial deposit
    }
    return (assets * totalShares) / totalAssets;
  };

  const convertToAssets = (shares: number, totalShares: number, totalAssets: number): number => {
    if (totalShares === 0) {
      return shares; // 1:1 initial deposit
    }
    return (shares * totalAssets) / totalShares;
  };

  // Offset Progressive Curve parameters (matching contract)
  const SLOPE = 0.01; // 1% slope
  const OFFSET = 50; // Offset value
  const HALF_SLOPE = SLOPE / 2;

  const calculatePrice = (currentSupply: number, curve: string) => {
    switch (curve) {
      case 'linear':
        // For linear curve: price = totalAssets / totalShares
        // We'll use a base of 100 ETH total assets for demo purposes
        const totalAssets = 100;
        return totalAssets / currentSupply;
      case 'offset-progressive':
        // P(s) = m * (s + offset) where m = SLOPE, offset = OFFSET
        return SLOPE * (currentSupply + OFFSET);
      default:
        return 100 / currentSupply;
    }
  };

  // Offset Progressive Curve: shares = sqrt((s + offset)² + 2a/m) - (s + offset)
  const calculateOffsetProgressiveShares = (assets: number, totalShares: number): number => {
    const currentSupplyWithOffset = totalShares + OFFSET;
    const shares = Math.sqrt(Math.pow(currentSupplyWithOffset, 2) + (2 * assets) / SLOPE) - currentSupplyWithOffset;
    return Math.max(0, shares);
  };

  // Offset Progressive Curve: assets = (2(s + offset)r - r²) * m/2
  const calculateOffsetProgressiveAssets = (shares: number, totalShares: number): number => {
    const currentSupplyWithOffset = totalShares + OFFSET;
    const assets = (2 * currentSupplyWithOffset * shares - Math.pow(shares, 2)) * HALF_SLOPE;
    return Math.max(0, assets);
  };

  const calculateCost = (currentSupply: number, amount: number, curve: string) => {
    switch (curve) {
      case 'linear': {
        // For linear curve: shares = assets (1:1 ratio when supply is 0)
        // When supply > 0: shares = (assets * totalShares) / totalAssets
        const totalAssets = 100; // Base assets for demo
        const totalShares = currentSupply;
        
        if (totalShares === 0) {
          // Initial deposit: 1:1 ratio
          return amount;
        } else {
          // Subsequent deposits: use conversion formula
          const sharesReceived = convertToShares(amount, totalAssets, totalShares);
          return amount; // Cost is the ETH amount deposited
        }
      }
      case 'offset-progressive': {
        // Calculate shares received for the given ETH amount
        const sharesReceived = calculateOffsetProgressiveShares(amount, currentSupply);
        // Cost is the ETH amount deposited
        return amount;
      }
      default: {
        const totalAssets = 100;
        const totalShares = currentSupply;
        if (totalShares === 0) {
          return amount;
        } else {
          const sharesReceived = convertToShares(amount, totalAssets, totalShares);
          return amount;
        }
      }
    }
  };

  const calculateSharesReceived = (currentSupply: number, amount: number, curve: string) => {
    switch (curve) {
      case 'linear': {
        const totalAssets = 100;
        const totalShares = currentSupply;
        
        if (totalShares === 0) {
          // Initial deposit: 1:1 ratio
          return amount;
        } else {
          // Subsequent deposits: use conversion formula
          return convertToShares(amount, totalAssets, totalShares);
        }
      }
      case 'offset-progressive': {
        // Use the correct formula from the contract
        return calculateOffsetProgressiveShares(amount, currentSupply);
      }
      default:
        return amount;
    }
  };

  const currentPrice = calculatePrice(supply, curveType);
  const cost = calculateCost(supply, amount, curveType);
  const sharesReceived = calculateSharesReceived(supply, amount, curveType);
  const newPrice = calculatePrice(supply + sharesReceived, curveType);

  return (
    <div className={clsx('bonding-curve-demo p-6 bg-gray-50 dark:bg-gray-800 rounded-lg', className)}>
      <h3 className="text-xl font-bold mb-4">Bonding Curve Interactive Demo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Parameters</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Curve Type</label>
              <select
                value={curveType}
                onChange={(e) => setCurveType(e.target.value as any)}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700"
              >
                <option value="linear">Linear Curve</option>
                <option value="offset-progressive">Offset Progressive Curve</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Current Supply: {supply}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={supply}
                onChange={(e) => setSupply(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Purchase Amount (ETH): {amount}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Results</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Current Price (ETH per share):</span>
              <span className="font-mono">{currentPrice.toFixed(4)} ETH</span>
            </div>
            
            <div className="flex justify-between">
              <span>Purchase Cost:</span>
              <span className="font-mono">{cost.toFixed(4)} ETH</span>
            </div>
            
            <div className="flex justify-between">
              <span>Shares Received:</span>
              <span className="font-mono">{sharesReceived.toFixed(4)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>New Price (ETH per share):</span>
              <span className="font-mono">{newPrice.toFixed(4)} ETH</span>
            </div>
            
            <div className="flex justify-between">
              <span>Price Impact:</span>
              <span className={clsx(
                'font-mono',
                newPrice > currentPrice ? 'text-green-600' : 'text-red-600'
              )}>
                {((newPrice - currentPrice) / currentPrice * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-sm">
              <strong>Linear Curve Note:</strong> Initial deposits are 1:1 (ETH deposited = shares received). 
              Subsequent deposits use the conversion formula: shares = (assets × totalShares) / totalAssets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 