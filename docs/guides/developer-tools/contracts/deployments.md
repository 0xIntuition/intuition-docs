---
title: Deployments
sidebar_position: 5
---

# Contract Deployments

## Mainnet

### Ethereum Mainnet
| Contract | Address |
|----------|---------|
| EthMultiVault | `0x...` |
| AtomWallet | `0x...` |
| Triple Factory | `0x...` |
| Atom Registry | `0x...` |

### Base Mainnet
| Contract | Address |
|----------|---------|
| EthMultiVault | `0x...` |
| AtomWallet | `0x...` |
| Triple Factory | `0x...` |
| Atom Registry | `0x...` |

## Testnet

### Base Sepolia Testnet
| Contract | Address |
|----------|---------|
| EthMultiVault | `0x7Ed501cCB265419380752919B03937daEcB87e37` |
| AtomWallet | `0x5E6C71dB24453B5a2262aA64c77b9ab90bfDF8ba` |
| Triple Factory | `0x4B7311De5470c02e5DD7beD73Fc4732629C72975` |
| Atom Registry | `0x89c7cC6E48b108f0f278eE6b643cf3aDc9C5Bd77` |

### Intuition Testnet (L3)
| Contract | Address |
|----------|---------|
| EthMultiVault | `0x...` |
| AtomWallet | `0x...` |
| Triple Factory | `0x...` |
| Atom Registry | `0x...` |

## Network Details

### Intuition Testnet Configuration
- **Chain ID**: 13579
- **RPC URL**: `https://testnet.intuition.systems`
- **WebSocket**: `wss://testnet.intuition.systems`
- **Explorer**: `https://explorer.testnet.intuition.systems`
- **Native Token**: $TTRUST

### Base Sepolia Configuration
- **Chain ID**: 84532
- **RPC URL**: `https://sepolia.base.org`
- **Explorer**: `https://sepolia.basescan.org`
- **Native Token**: ETH

## Verified Contracts

All deployed contracts are verified on their respective block explorers. You can view the source code and interact with the contracts directly through the explorer interfaces.

## Contract ABIs

Contract ABIs can be found in the following locations:
- **npm package**: `@0xintuition/protocol`
- **GitHub**: [0xIntuition/intuition-contracts](https://github.com/0xintuition/intuition-contracts)
- **Block Explorer**: Available on verified contract pages

## Deployment Notes

- All contracts are upgradeable using the UUPS (Universal Upgradeable Proxy Standard) pattern
- Contract ownership is managed through a multi-signature wallet
- Deployment scripts and migration guides are available in the official repositories