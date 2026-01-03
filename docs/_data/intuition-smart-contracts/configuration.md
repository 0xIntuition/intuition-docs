---
title: Configurations & Fees
sidebar_position: 5
---

# Configurations & Fees

The Intuition protocol smart contracts utilize a configuration system that allows for dynamic adjustment of various parameters effecting the behavior of the protocol. This document outlines the key configuration parameters and fees associated with the **mainnet Intuition protocol** deployment.

The smart contract configurations and parameters can be adjusted by governance through onchain proposals, allowing for flexibility and adaptability as the protocol evolves.

## MultiVault

### Atom & Triple Creation Fees

The following fixed fees are applied when creating atoms and triples within the MultiVault:

- **Atom Creation Fee:** 0.1 TRUST <span className='text-xs'>(1e17)</span>
- **Triple Creation Fee:** 0.1 TRUST <span className='text-xs'>(1e17)</span>

### Deposit & Withdrawal Fees & Minimums

When depositing into an atom or triple, a minimum amount of TRUST is required:   

- **Minimum Deposit:** 0.01 TRUST <span className='text-xs'>(1e16)</span>

The percentage-based fees are applied to the total TRUST being deposited/withdrawn after accounting for fixed costs:

- **Entry Fee:** 50  <span className='text-xs'>(0.5% of deposit)</span>
- **Exit Fee:** 75  <span className='text-xs'>(0.75% of deposit)</span>
- **Protocol Fee:** 125  <span className='text-xs'>(1.25% of deposit)</span>
- **Atom Deposit Fraction Fee:**  90 <span className='text-xs'>(0.9% of deposit into atom from triple)</span>*

\* <span class='text-xs'>*This fee is only applied when depositing into a triple, and a portion of the deposit is allocated to the underlying atoms.*</span>

**The percentage fees are calculated using a denominator of 10,000.**

For example, if a user deposits 100 TRUST into an atom, the entry fee would be calculated as follows:

- ```Entry Fee = (50 / 10,000) * 100 TRUST = 0.5 TRUST```
- ```Protocol Fee = (125 / 10,000) * 100 TRUST = 1.25 TRUST```

The total fees for 100 TRUST deposit would be 0.5 TRUST (entry fee) + 1.25 TRUST (protocol fee) = 1.75 TRUST.

### Low-Level Configuration Parameters

The Intuition Smart Contracts also include several low-level configuration parameters that can be adjusted by governance to fine-tune the protocol's behavior. These parameters include:

- **Fee Denominator:** 10000
- **Minimum Shares** : 1e6 <span className='text-xs'>(1,000,000 WEI)</span>
- **Atom Data Max Length:** 1000


## TrustBonding & EmissionsController

The TrustBonding, BaseEmissionsController and SatelliteEmissionsController all share the same configuration parameters for emissions. This allows for a consistent emission schedule across the protocol, even though new TRUST tokens are minted on the Base (8453) network and released on the Intuition (1155) network.

- **Emissions Per Epoch:** 2,884,615.3846 <span className='text-xs'>(approx 2.88 million TRUST every two weeks for the first year)</span>
- **Emissions Start Timestamp:** 1762268400 <span className='text-xs'>(Tues November 4, 2025 10:00:00 EST)</span>
- **Emissions Length:** 1209600 <span className='text-xs'>(Two Weeks)</span>
- **Emissions Reduction Points:** 1000 <span className='text-xs'>(10%)</span>
- **Emissions Reduction Cliff:** 26 <span className='text-xs'>(1 year i.e. two weeks x 26)</span>\*

\* <span class='text-xs'> *The emissions reduction cliff indicates that after every 26 emission periods (i.e. every year), the emissions will reduce by the specified reduction points (10%). For example, if the initial emissions are 1000 TRUST per period, after one year (26 periods), the emissions will reduce to 900 TRUST per period.* </span>

## OffsetProgressiveCurve

The Offset Progressive Curve is used to calculate the amount of shares minted when a user deposits. The curve is defined by the following parameters:

- **Offset:** 1e17
- **Slope:** 3e19 

The OffsetProgressiveCurve parameters are fixed and cannot be changed by governance.