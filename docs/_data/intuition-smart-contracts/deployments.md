---
title: Deployments
sidebar_position: 1
---

# Contract Deployments

The Intuition protocol contracts are deployed on both the Base Mainnet and the Intuition Layer 3 network, as well as their respective testnets. Below are the details of the deployed contracts, including their addresses and network configurations.

The protocol and periphery addresses match the [`@0xintuition/deployments`](https://www.npmjs.com/package/@0xintuition/deployments) package, which is the source of truth for contract addresses and ABIs. In code, resolve addresses from the package (for example `getMultiVaultAddressFromChainId(chainId)`) rather than copying them from this page. The timelocks, SafeSingletonFactory and the TRUST bridge hub are listed here for reference only.

The Upgrades TimelockControllers own the proxy admins, so every contract upgrade waits out their delay: 7 days on mainnet and 1 hour on testnet. The Parameters TimelockController is the only account that can change MultiVault's configuration, with a 3-day delay on mainnet and 1 hour on testnet.

## Mainnet

### Base Mainnet

| Contract Name               | Address                                    |
| --------------------------- | ------------------------------------------ |
| Trust (ERC20)               | 0x6cd905dF2Ed214b22e0d48FF17CD4200C1C6d8A3 |
| BaseEmissionsController     | 0x7745bDEe668501E5eeF7e9605C746f9cDfb60667 |
| Upgrades TimelockController | 0x1E442BbB08c98100b18fa830a88E8A57b5dF9157 |

### Intuition Mainnet (L3)

| Contract Name                 | Address                                    |
| ----------------------------- | ------------------------------------------ |
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
| FeeProxy                      | 0x45B65BB9FFC4BC51C9e3a56902d9183dcff51B55 |

## Testnet

### Base Sepolia Testnet

| Contract Name               | Address                                    |
| --------------------------- | ------------------------------------------ |
| TestTrust                   | 0xA54b4E6e356b963Ee00d1C947f478d9194a1a210 |
| BaseEmissionsController     | 0x6B96fB3867b666A7957fa589866627ea902ec2C6 |
| Upgrades TimelockController | 0xE16E8e10664d399D36D2220fFA763e9367980507 |

### Intuition Testnet (L3)

| Contract Name                 | Address                                    |
| ----------------------------- | ------------------------------------------ |
| WrappedTrust                  | 0xDE80b6EE63f7D809427CA350e30093F436A0fe35 |
| Upgrades TimelockController   | 0xc7721c865ba0bDf760073594922434Edc0C2d200 |
| Parameters TimelockController | 0x50B874C22e4D54db9ACeE181bF2D5a0663D2D70A |
| MultiVault                    | 0xF76d6976DeBFbB012ebc53e925BC4AEFCaA7C6c6 |
| AtomWalletFactory             | 0x900cff1007055c850FB48695a3CB121290d6f17b |
| AtomWalletBeacon              | 0x16deCCF5484bE9FFb5c8a2d800E0fdf27b876012 |
| AtomWarden                    | 0xf3f875E0d390C9bA8Aa21881E983baDe91866A38 |
| SatelliteEmissionsController  | 0x2f4ef00b05f5AA9976154125Cc46D47CAB75B1b7 |
| TrustBonding                  | 0x9E79446fE4B1683eF1678654554535a9c90B1C3D |
| BondingCurveRegistry          | 0xb3bfd62d259E07d623844fC7bDB7D54F74Ff9052 |
| LinearCurve                   | 0x7499bFa918DBc73Ace4A05D6194a5Cd343AE32Dd |
| OffsetProgressiveCurve        | 0x96bb9020ba4D027E42C29eCB3CEcc2471E505E6C |
| Multicall3                    | 0xcA11bde05977b3631167028862bE2a173976CA11 |
| EntryPoint                    | 0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108 |
| FeeProxy                      | 0x847801465DcB17811089107c0051c49E0135F6B8 |

The Intuition Testnet MultiVault runs v1.1.0.

## Periphery

Periphery contracts provide auxiliary functions around the core protocol, such as bridging tokens and minting emissions. FeeProxy is listed with the L3 contracts above.

### Base Mainnet

| Contract Name              | Address                                    |
| -------------------------- | ------------------------------------------ |
| EmissionsAutomationAdapter | 0xb1ce9Ac324B5C3928736Ec33b5Fd741cb04a2F2d |
| MetaERC20Hub (TRUST)       | 0xE12aaF1529Ae21899029a9b51cca2F2Bc2cfC421 |
| MetaERC20Hub (USDC)        | 0x7e41962bE9B2640e653BfA8c8713A905659FE157 |
| MetaERC20Hub (WETH)        | 0xFB4BAa05BF339AD6074047176F90757A6C87f944 |

EmissionsAutomationAdapter is called only by the emissions keeper, so it is not part of `@0xintuition/deployments`.

### Intuition Mainnet (L3)

| Contract Name           | Address                                    |
| ----------------------- | ------------------------------------------ |
| MetaNativeSpoke (TRUST) | 0x375135fe908dD62f3C7939FA4e65bf41Da721AB9 |
| MetaERC20Spoke (USDC)   | 0x7e41962bE9B2640e653BfA8c8713A905659FE157 |
| MetaERC20Spoke (WETH)   | 0xFB4BAa05BF339AD6074047176F90757A6C87f944 |

The Metalayer hubs on Base and spokes on Intuition bridge TRUST, USDC and WETH between the two chains. TRUST arrives on Intuition as the native token through MetaNativeSpoke; the USDC and WETH hubs share an address with their spokes.

## Network Details

### Intuition Mainnet Configuration

- **Chain ID**: 1155
- **RPC URL**: `https://rpc.intuition.systems`
- **WebSocket**: `wss://rpc.intuition.systems/ws`
- **Explorer**: `https://explorer.intuition.systems/`
- **Native Token**: $TRUST

### Intuition Testnet Configuration

- **Chain ID**: 13579
- **RPC URL**: `https://testnet.rpc.intuition.systems`
- **WebSocket**: `wss://testnet.rpc.intuition.systems/ws`
- **Explorer**: `https://testnet.explorer.intuition.systems/`
- **Native Token**: $tTRUST

### Base Sepolia Configuration

- **Chain ID**: 84532
- **RPC URL**: `https://sepolia.base.org`
- **Explorer**: `https://sepolia.basescan.org`
- **Native Token**: ETH

### Base Mainnet Configuration

- **Chain ID**: 8453
- **RPC URL**: `https://mainnet.base.org`
- **Explorer**: `https://basescan.org`
- **Native Token**: ETH

## Verified Contracts

All deployed contracts are verified on their respective block explorers. You can view the source code and interact with the contracts directly through the explorer interfaces.

## Contract ABIs

Contract ABIs can be found in the following locations:

- **npm package**: `@0xintuition/deployments` (addresses, ABIs and bytecode). `@0xintuition/protocol` and `@0xintuition/sdk` re-export the core ABIs and address helpers.
- **GitHub**: [0xIntuition/intuition-contracts-v2](https://github.com/0xIntuition/intuition-contracts-v2/tree/main/abis)
- **Block Explorer**: Available on verified contract pages
