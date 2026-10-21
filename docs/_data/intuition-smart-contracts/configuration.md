---
title: Configurations & Fees
sidebar_position: 5
---

# Configurations & Fees

The Intuition protocol smart contracts utilize a configuration system that allows for dynamic adjustment of various parameters effecting the behavior of the protocol. This document outlines the key configuration parameters and fees associated with the **mainnet Intuition protocol** deployment.

The smart contract configurations and parameters can be adjusted by governance through onchain proposals, allowing for flexibility and adaptability as the protocol evolves. From v1.1.0, every MultiVault configuration change goes through the Parameters TimelockController (see [Who can change the configuration](#who-can-change-the-configuration)).

## MultiVault

### Atom & Triple Creation Fees

The following fixed fees are applied when creating atoms and triples within the MultiVault:

- **Atom Creation Fee:** 0.1 TRUST <span className='text-xs'>(1e17)</span>
- **Triple Creation Fee:** 0.1 TRUST <span className='text-xs'>(1e17)</span>

The full fixed cost of creating a term also seeds the new vault's minimum shares (see **Minimum Shares** below): `getAtomCost()` is the atom creation fee plus 1e6 wei, and `getTripleCost()` is the triple creation fee plus 2e6 wei.

### Deposit & Withdrawal Fees & Minimums

When depositing into an atom or triple, a minimum amount of TRUST is required:

- **Minimum Deposit:** 0.01 TRUST <span className='text-xs'>(1e16)</span>

The percentage-based fees are applied to the total TRUST being deposited/withdrawn after accounting for fixed costs:

- **Entry Fee:** 50 <span className='text-xs'>(0.5% of deposit)</span>†
- **Exit Fee:** 75 <span className='text-xs'>(0.75% of redemption)</span>†
- **Protocol Fee:** 125 <span className='text-xs'>(1.25% of deposit or redemption)</span>
- **Atom Wallet Deposit Fee:** 50 <span className='text-xs'>(0.5% of a deposit into an atom, paid to the atom's wallet)</span>
- **Atom Deposit Fraction Fee:** 90 <span className='text-xs'>(0.9% of deposit into atom from triple)</span>\*

\* <span class='text-xs'>_This fee is only applied when depositing into a triple, and a portion of the deposit is allocated to the underlying atoms._</span>

† <span class='text-xs'>_The entry fee applies only when the term's vault on the default curve holds at least the fee threshold of 1 share (1e18). The exit fee applies only when that vault still holds at least the threshold after the redemption. Both fees stay in the term's vault on the default curve, which raises its share price for the vault's shareholders._</span>

**The percentage fees are calculated using a denominator of 10,000.**

For example, if a user deposits 100 TRUST into an existing atom whose fee threshold is met, the fees would be calculated as follows:

- `Entry Fee = (50 / 10,000) * 100 TRUST = 0.5 TRUST`
- `Protocol Fee = (125 / 10,000) * 100 TRUST = 1.25 TRUST`
- `Atom Wallet Deposit Fee = (50 / 10,000) * 100 TRUST = 0.5 TRUST`

The total fees for 100 TRUST deposit would be 0.5 TRUST (entry fee) + 1.25 TRUST (protocol fee) + 0.5 TRUST (atom wallet deposit fee) = 2.25 TRUST.

### Low-Level Configuration Parameters

The Intuition Smart Contracts also include several low-level configuration parameters that can be adjusted by governance to fine-tune the protocol's behavior. These parameters include:

- **Fee Denominator:** 10000
- **Minimum Shares** : 1e6 <span className='text-xs'>(1,000,000 WEI)</span>
- **Atom Data Max Length:** 1000
- **Fee Threshold:** 1e18 <span className='text-xs'>(1 share on the default curve)</span>
- **Default Curve ID:** 1 <span className='text-xs'>(LinearCurve)</span>

### Atom URI Limits (v1.1.0)

`createAtomsWithUris` attaches context URIs to new atoms. Two limits apply, read with `getAtomUriConfig()`:

- **Max URIs per Atom:** 5
- **Max URI Length:** 700 bytes

These are the defaults that apply until governance sets other values with `setAtomUriConfig`. Neither limit can be set to 0.

### Who can change the configuration

From v1.1.0, only the Parameters TimelockController can call MultiVault's configuration setters. Any other caller reverts with `MultiVault_OnlyTimelock`.

| Setter                  | Changes                                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `setGeneralConfig`      | Admin, protocol multisig, fee denominator, TrustBonding, minimum deposit, minimum shares, atom data max length, fee threshold |
| `setAtomConfig`         | Atom creation fee, atom wallet deposit fee                                                                                    |
| `setTripleConfig`       | Triple creation fee, atom deposit fraction                                                                                    |
| `setVaultFees`          | Entry, exit and protocol fees                                                                                                 |
| `setWalletConfig`       | EntryPoint, AtomWarden, atom wallet beacon, AtomWalletFactory                                                                 |
| `setBondingCurveConfig` | Bonding curve registry and default curve ID                                                                                   |
| `setAtomUriConfig`      | Atom URI limits                                                                                                               |
| `setTimelock`           | The timelock itself                                                                                                           |

On mainnet, the Parameters TimelockController has a 3-day delay, so a configuration change is visible on-chain for 3 days before it takes effect. Read the current values with `timelock()` and the `get...Config()` functions on MultiVault.

## TrustBonding & EmissionsController

The TrustBonding, BaseEmissionsController and SatelliteEmissionsController all share the same configuration parameters for emissions. This allows for a consistent emission schedule across the protocol, even though new TRUST tokens are minted on the Base (8453) network and released on the Intuition (1155) network.

- **Emissions Per Epoch:** 2,884,615.3846 <span className='text-xs'>(approx 2.88 million TRUST every two weeks for the first year)</span>
- **Emissions Start Timestamp:** 1762268400 <span className='text-xs'>(Tues November 4, 2025 10:00:00 EST)</span>
- **Emissions Length:** 1209600 <span className='text-xs'>(Two Weeks)</span>
- **Emissions Reduction Points:** 1000 <span className='text-xs'>(10%)</span>
- **Emissions Reduction Cliff:** 26 <span className='text-xs'>(1 year i.e. two weeks x 26)</span>\*

\* <span class='text-xs'> _The emissions reduction cliff indicates that after every 26 emission periods (i.e. every year), the emissions will reduce by the specified reduction points (10%). For example, if the initial emissions are 1000 TRUST per period, after one year (26 periods), the emissions will reduce to 900 TRUST per period._ </span>

## Bonding Curves

MultiVault prices shares with the curves registered in the BondingCurveRegistry. Each vault uses one curve, chosen by the `curveId` of the deposit.

| Curve ID | Curve                  | Use                                                           |
| -------- | ---------------------- | ------------------------------------------------------------- |
| 1        | LinearCurve            | The default curve. Every new atom and triple starts on it.    |
| 2        | OffsetProgressiveCurve | An optional curve on which the share price rises with supply. |

### LinearCurve

LinearCurve has no parameters. It mints shares pro rata to a vault's assets:

- `shares = assets * totalShares / totalAssets` (and 1:1 while the vault is empty)
- `assets = shares * totalAssets / totalShares`

The share price changes only when the vault's assets change without new shares, for example when entry and exit fees stay in the vault. The creation paths rely on this curve being the default, because they seed each new vault 1:1.

### OffsetProgressiveCurve

The Offset Progressive Curve is used to calculate the amount of shares minted when a user deposits. The share price grows linearly with the vault's total shares, starting from an offset. The curve is defined by the following parameters:

- **Slope:** 1e17
- **Offset:** 3e19

Read them on-chain with `SLOPE()` and `OFFSET()`. The OffsetProgressiveCurve parameters are fixed and cannot be changed by governance.
