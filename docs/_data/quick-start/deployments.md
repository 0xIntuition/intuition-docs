---
title: Contract Deployments
sidebar_position: 4
---

# Contract Deployments

The Intuition protocol contracts are deployed on both the Base Mainnet and the Intuition Layer 3 network, as well as their respective testnets. Below are the details of the deployed contracts, including their addresses and network configurations.

## Mainnet

### Base Mainnet

| Contract      | Address                                    |
|---------------|--------------------------------------------|
| Trust (ERC20) | 0x6cd905dF2Ed214b22e0d48FF17CD4200C1C6d8A3 |

### Intuition Mainnet (L3)

| Contract Name                 | Address                                    |
|-------------------------------|--------------------------------------------|
| WrappedTrust                  | 0x81cFb09cb44f7184Ad934C09F82000701A4bF672 |
| Upgrades TimelockController   | 0x321e5d4b20158648dFd1f360A79CAFc97190bAd1 |
| Parameters TimelockController | 0x71b0F1ABebC2DaA0b7B5C3f9b72FAa1cd9F35FEA |
| MultiVault                    | 0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e |
| AtomWalletFactory             | 0x33827373a7D1c7C78a01094071C2f6CE74253B9B |
| AtomWalletBeacon              | 0xC23cD55CF924b3FE4b97deAA0EAF222a5082A1FF |
| AtomWarden                    | 0x98C9BCecf318d0D1409Bf81Ea3551b629fAEC165 |
| SatelliteEmissionsController  | 0x73B8819f9b157BE42172E3866fB0Ba0d5fA0A5c6 |
| TrustBonding                  | 0x635bBD1367B66E7B16a21D6E5A63C812fFC00617 |
| BondingCurveRegistry          | 0xd0E488Fb32130232527eedEB72f8cE2BFC0F9930 |
| LinearCurve                   | 0xc3eFD5471dc63d74639725f381f9686e3F264366 |
| OffsetProgressiveCurve        | 0x23afF95153aa88D28B9B97Ba97629E05D5fD335d |
| Multicall3                    | 0xcA11bde05977b3631167028862bE2a173976CA11 |
| EntryPoint                    | 0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108 |
| SafeSingletonFactory          | 0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7 |

## Testnet

### Base Sepolia Testnet

| Contract Name               | Address                                    |
|-----------------------------|--------------------------------------------|
| TestTrust                   | 0xA54b4E6e356b963Ee00d1C947f478d9194a1a210 |
| Upgrades TimelockController | 0x9099BC9fd63B01F94528B60CEEB336C679eb6d52 |
| BaseEmissionsController     | 0xC14773Aae24aA60CB8F261995405C28f6D742DCf |

### Intuition Testnet (L3)

| Contract Name                 | Address                                    |
|-------------------------------|--------------------------------------------|
| WrappedTrust                  | 0xDE80b6EE63f7D809427CA350e30093F436A0fe35 |
| Upgrades TimelockController   | 0x59B7EaB1cFA47F8E61606aDf79a6b7B5bBF1aF26 |
| Parameters TimelockController | 0xcCB113bfFf493d80F32Fb799Dca23686a04302A7 |
| MultiVault                    | 0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91 |
| AtomWalletFactory             | 0xa4e96c6dB8Dd3314c64bF9d0E845A4905a8705d4 |
| AtomWalletBeacon              | 0x4B0aC884843576dBA0B0fda925f202aB8b546E33 |
| AtomWarden                    | 0x040B7760EFDEd7e933CFf419224b57DFB9Eb4488 |
| SatelliteEmissionsController  | 0xD3be4d1E56866b98f30Ae6C326F14EF9c6ffBBDF |
| TrustBonding                  | 0x75dD32b522c89566265eA32ecb50b4Fc4d00ADc7 |
| BondingCurveRegistry          | 0x2AFC4949Dd3664219AA2c20133771658E93892A1 |
| LinearCurve                   | 0x6df5eecd9B14E31C98A027b8634876E4805F71B0 |
| OffsetProgressiveCurve        | 0xE65EcaAF5964aC0d94459A66A59A8B9eBCE42CbB |
| Multicall3                    | 0xcA11bde05977b3631167028862bE2a173976CA11 |
| EntryPoint                    | 0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108 |

## Network Details

### Intuition Mainnet Configuration
- **Chain ID**: 1155
- **RPC URL**: `https://rpc.intuition.systems`
- **WebSocket**: `wss://rpc.intuition.systems`
- **Explorer**: `https://explorer.intuition.systems/`
- **Native Token**: $TRUST

### Intuition Testnet Configuration
- **Chain ID**: 13579
- **RPC URL**: `https://testnet.rpc.intuition.systems`
- **WebSocket**: `wss://testnet.rpc.intuition.systems`
- **Explorer**: `https://testnet.explorer.intuition.systems/`
- **Native Token**: $tTRUST

### Base Sepolia Configuration
- **Chain ID**: 84532
- **RPC URL**: `https://sepolia.base.org`
- **Explorer**: `https://sepolia.basescan.org`
- **Native Token**: ETH

### Base Sepolia Configuration
- **Chain ID**: 8453
- **RPC URL**: `https://mainnet.base.org`
- **Explorer**: `https://basescan.org`
- **Native Token**: ETH

## Verified Contracts

All deployed contracts are verified on their respective block explorers. You can view the source code and interact with the contracts directly through the explorer interfaces.

## Contract ABIs

Contract ABIs can be found in the following locations:
- **npm package**: `@0xintuition/protocol`
- **GitHub**: [0xIntuition/intuition-contracts-v2](https://github.com/0xIntuition/intuition-contracts-v2/tree/main/abis)
- **Block Explorer**: Available on verified contract pages
