---
title: "Deployments"
sidebar_label: "Deployments"
description: "Look up the pinned core, periphery, bridge asset and multicall addresses by chain ID."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/deployments"]
---

<AppliesTo />

Use the chain ID and contract name together when selecting an address. For an asset-specific hub or spoke, also match the asset. The table contains the address maps exported by the pinned deployments package.

| Chain ID | Network |
| --- | --- |
| 1155 | Intuition mainnet |
| 13579 | Intuition testnet |
| 8453 | Base mainnet, for Base-side contracts and bridge assets |
| 84532 | Base Sepolia, for associated testnet contracts |

## Contract addresses

{/* generated:start deployments */}

| Chain ID | Contract | Asset | Address |
| --- | --- | --- | --- |
| 1155 | AtomWalletBeacon | — | `0xC23cD55CF924b3FE4b97deAA0EAF222a5082A1FF` |
| 1155 | AtomWalletFactory | — | `0x33827373a7D1c7C78a01094071C2f6CE74253B9B` |
| 1155 | AtomWarden | — | `0x98C9BCecf318d0D1409Bf81Ea3551b629fAEC165` |
| 1155 | BondingCurveRegistry | — | `0xd0E488Fb32130232527eedEB72f8cE2BFC0F9930` |
| 1155 | EntryPoint | — | `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108` |
| 1155 | FeeProxy | — | `0x45B65BB9FFC4BC51C9e3a56902d9183dcff51B55` |
| 1155 | LinearCurve | — | `0xc3eFD5471dc63d74639725f381f9686e3F264366` |
| 1155 | MetaERC20Spoke | USDC | `0x7e41962bE9B2640e653BfA8c8713A905659FE157` |
| 1155 | MetaERC20Spoke | WETH | `0xFB4BAa05BF339AD6074047176F90757A6C87f944` |
| 1155 | MetaNativeSpoke | — | `0x375135fe908dD62f3C7939FA4e65bf41Da721AB9` |
| 1155 | MultiVault | — | `0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e` |
| 1155 | OffsetProgressiveCurve | — | `0x23afF95153aa88D28B9B97Ba97629E05D5fD335d` |
| 1155 | SatelliteEmissionsController | — | `0x73B8819f9b157BE42172E3866fB0Ba0d5fA0A5c6` |
| 1155 | TrustBonding | — | `0x635bBD1367B66E7B16a21D6E5A63C812fFC00617` |
| 1155 | WrappedTrust | — | `0x81cFb09cb44f7184Ad934C09F82000701A4bF672` |
| 1155 | multicall3 | — | `0xcA11bde05977b3631167028862bE2a173976CA11` |
| 8453 | Base bridge asset | USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| 8453 | Base bridge asset | WETH | `0x4200000000000000000000000000000000000006` |
| 8453 | BaseEmissionsController | — | `0x7745bDEe668501E5eeF7e9605C746f9cDfb60667` |
| 8453 | MetaERC20Hub | USDC | `0x7e41962bE9B2640e653BfA8c8713A905659FE157` |
| 8453 | MetaERC20Hub | WETH | `0xFB4BAa05BF339AD6074047176F90757A6C87f944` |
| 8453 | Trust | — | `0x6cd905dF2Ed214b22e0d48FF17CD4200C1C6d8A3` |
| 13579 | AtomWalletBeacon | — | `0x16deCCF5484bE9FFb5c8a2d800E0fdf27b876012` |
| 13579 | AtomWalletFactory | — | `0x900cff1007055c850FB48695a3CB121290d6f17b` |
| 13579 | AtomWarden | — | `0xf3f875E0d390C9bA8Aa21881E983baDe91866A38` |
| 13579 | BondingCurveRegistry | — | `0xb3bfd62d259E07d623844fC7bDB7D54F74Ff9052` |
| 13579 | DynamicFeeFlatPriceCurve | — | `0x3Bd2D1335161f3F2FA9eaA35a537415F7b10156A` |
| 13579 | EntryPoint | — | `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108` |
| 13579 | FeeProxy | — | `0x847801465DcB17811089107c0051c49E0135F6B8` |
| 13579 | LinearCurve | — | `0x7499bFa918DBc73Ace4A05D6194a5Cd343AE32Dd` |
| 13579 | MultiVault | — | `0xF76d6976DeBFbB012ebc53e925BC4AEFCaA7C6c6` |
| 13579 | OffsetProgressiveCurve | — | `0x96bb9020ba4D027E42C29eCB3CEcc2471E505E6C` |
| 13579 | SatelliteEmissionsController | — | `0x2f4ef00b05f5AA9976154125Cc46D47CAB75B1b7` |
| 13579 | TrustBonding | — | `0x9E79446fE4B1683eF1678654554535a9c90B1C3D` |
| 13579 | WrappedTrust | — | `0xDE80b6EE63f7D809427CA350e30093F436A0fe35` |
| 13579 | multicall3 | — | `0xcA11bde05977b3631167028862bE2a173976CA11` |
| 84532 | BaseEmissionsController | — | `0x6B96fB3867b666A7957fa589866627ea902ec2C6` |
| 84532 | Trust | — | `0xA54b4E6e356b963Ee00d1C947f478d9194a1a210` |

{/* generated:end */}

The `TrustSwapAndBridgeRouter` map is empty in this release. The package explains that the older Base router predates the deadline parameter in its ABI. `DynamicFeeFlatPriceCurve` has an address only on Intuition testnet in this pin. Empty entries supply no target for an application.

## Match the implementation

The pinned contract repository lists a different mainnet WrappedTrust address in its deployment notes. The table above follows the V2 package used by its lookup helpers. Check the intended deployment before carrying an address over from an older integration. [Contract repository deployment notes](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/deployments.md)

Core lookup helpers accept `AddressOverrides` keyed by contract name and chain ID for historical or custom deployments. An override selects the requested address. For a historical read, also select the block and ABI appropriate to that deployment. The core v1.1.0 ABI describes the published artifact. The deployments package cautions that new functions require the corresponding mainnet upgrade. Confirm implementation compatibility for the network and block before relying on a new method.

[Core addresses](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/src/deployments.ts) · [Periphery and bridge addresses](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/src/periphery-deployments.ts) · [Address overrides](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/src/address-overrides.ts) · [Compatibility notes](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/README.md)
