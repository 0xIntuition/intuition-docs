import React, { useState } from 'react';
import clsx from 'clsx';

interface BondingCurveDemoProps {
  className?: string;
}

export default function BondingCurveDemo({ className }: BondingCurveDemoProps) {
  const [supply, setSupply] = useState(100);
  const [curveType, setCurveType] = useState<'linear' | 'offset-progressive'>('linear');
  const [amount, setAmount] = useState(10);

  const calculatePrice = (currentSupply: number, curve: string) => {
    switch (curve) {
      case 'linear':
        return currentSupply * 0.01;
      case 'offset-progressive':
        // P(s) = m * (s + offset) where m = 0.01, offset = 50
        return 0.01 * (currentSupply + 50);
      default:
        return currentSupply * 0.01;
    }
  };

  const calculateCost = (currentSupply: number, amount: number, curve: string) => {
    switch (curve) {
      case 'linear': {
        // For linear: cost = (startPrice + endPrice) / 2 * amount
        const startPrice = calculatePrice(currentSupply, curve);
        const endPrice = calculatePrice(currentSupply + amount, curve);
        return ((startPrice + endPrice) / 2) * amount;
      }
      case 'offset-progressive': {
        // Cost = (m/2) * [(s₂ + offset)² − (s₁ + offset)²]
        // where m = 0.01, offset = 50
        const m = 0.01;
        const offset = 50;
        const s1 = currentSupply;
        const s2 = currentSupply + amount;
        return (m / 2) * (Math.pow(s2 + offset, 2) - Math.pow(s1 + offset, 2));
      }
      default: {
        const startPrice = calculatePrice(currentSupply, curve);
        const endPrice = calculatePrice(currentSupply + amount, curve);
        return ((startPrice + endPrice) / 2) * amount;
      }
    }
  };

  const currentPrice = calculatePrice(supply, curveType);
  const cost = calculateCost(supply, amount, curveType);
  const newPrice = calculatePrice(supply + amount, curveType);

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
                Purchase Amount: {amount}
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
              <span>Current Price:</span>
              <span className="font-mono">${currentPrice.toFixed(4)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Purchase Cost:</span>
              <span className="font-mono">${cost.toFixed(4)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>New Price:</span>
              <span className="font-mono">${newPrice.toFixed(4)}</span>
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
              <strong>How it works:</strong> As you increase supply, the price automatically adjusts based on the bonding curve. 
              Early buyers get better prices, creating incentives for early adoption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 