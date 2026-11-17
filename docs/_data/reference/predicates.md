---
title: Predicate catalog
sidebar_label: Predicate catalog
description: Find a predicate’s key, status and deterministic atom ID in the published predicate registry.
kind: reference
reader: ["app","agent"]
packages: ["@0xintuition/predicates"]
---

<AppliesTo />

A predicate names the relation a triple asserts between its subject and object. To say that two catalog entries refer to the same real-world entity, look up the key `sameAs`. Its label is “same as” and its predicate atom ID is `0x1908b7994ca437c84c67a4799ae710355591790a726bf5890277f3aa70828c0a`. That ID belongs in the middle of the triple. Looking it up is a local operation. Submitting the claim takes a separate transaction, and deciding whether to accept it takes evidence about both entries. [Registry definition of sameAs](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/generated/specs/sameAs.ts) · [Identity claims](/docs/concepts/same-as)

## Read a predicate row

- **Key** selects the definition in application code. **Label** is the human-readable name. The record also contains a description that explains the relation. [Predicate record](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/record.ts)
- **Status** is the registry’s designation. At this release 25 definitions are enshrined and 108 are proposed. The separate launch list selects the 25 enshrined keys. A node’s local database seeds are another, smaller vocabulary. Use the full registry for protocol IDs. [Launch list](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/launch.ts) · [Core database seeds](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/database-kg/src/seeds/predicates.ts)
- **Atom ID** identifies the exact serialized definition. The package writes a JSON-LD `DefinedTerm` with `@context`, `@type`, `name` and `description` in that order, then derives the atom ID from those bytes. Hashing the display label alone or rewording the description produces different bytes. Keep the ID from `PREDICATE_IDS` when translating a label for display. [Predicate payload format](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/predicate-id.ts) · [Atom ID calculation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/atom-id.ts)

## Predicate lookup

The table pairs each entry in `PREDICATE_RECORDS` with the full ID from `PREDICATE_IDS` under the same key. To build a selection menu that keeps the chosen ID with its label, follow the predicate picker example. [Registry lookups](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/predicates.ts) · [Predicate picker](/docs/examples/predicate-picker)

{/* generated:start predicates */}

| Key | Label | Status | Atom ID |
| --- | --- | --- | --- |
| `actor` | actor | proposed | `0x7c9a29122ab978cd91542fc76f6c7a1d99d65362d41a308863bd295462051196` |
| `affiliatedWith` | affiliated with | proposed | `0x65711e57db67c836afd7bdfe80b5b0d1021a83c2623c9f2dab85af5cd7d8106f` |
| `agreeWith` | agree with | enshrined | `0x55a44b059ca98ac95d5987ef62f285542715e87dc9cb337de5cd4699ec838d11` |
| `alternativeTo` | alternative to | enshrined | `0x2497709bf8f757952d1ef4097943fbc676c3ec23207f8473a34e2757f771e9f3` |
| `alumniOf` | alumni of | proposed | `0x45e98e5eef934cae066c53a0af0195e78b2c6e2c1c2077aad31466763782507c` |
| `areaServed` | area served | proposed | `0x863fc50bcf99d925ebc537dab0b6b190e1f4b0c17aa610aafd1835df76156b68` |
| `attestedBy` | attested by | proposed | `0x46edc69922cfe75fc3ad252c625e8a6b37f0223147320be40cbdc0cdd1970cd8` |
| `auditedBy` | audited by | proposed | `0x0d6d3c4e6e6ee7b2b2c488d48d70ab3defd5d0844f8f84724616528cd59b03c4` |
| `authoredBy` | authored by | proposed | `0x19e5da5af4adf03fb4d69e6910be4f17f9c612d98f150d2e9e0f3569cea304a9` |
| `availableOn` | available on | proposed | `0xea46b891287568210d4614fdb31147cd009ad6d7731657c5341889b3789eceeb` |
| `backedBy` | backed by | proposed | `0x6bea1623e6d3273aa6d31becdc29782e77ac141dbb87f51aa3994552e5e653bb` |
| `bearishOn` | bearish on | enshrined | `0xeb91df72671d540bf0ab283b9b98fced6e5acbb5925a101b8351c47bc4119a08` |
| `betterThan` | better than | enshrined | `0x9111f910eac0d5c239048754d4527870a40902bd662af706a0ec6f0dc8ad3bfe` |
| `blocked` | blocked | proposed | `0x0e8d6778212b54be16f0f3cc893eb9519935cc1076257cc2343c591b56bc1821` |
| `branchOf` | branch of | proposed | `0x5ec48ef77880acba5d340787e32107171df17fc9b354483fe13ec4b73aa2148c` |
| `brand` | brand | proposed | `0xb4bff7194354fe3119bbf4c207a8128bd174242d728668f14e6d80fb05bff74d` |
| `bullishOn` | bullish on | enshrined | `0x0ab87a5ba67b22c33e13a2424ba3dd372bef468e8958dd32e9e74fe93f621bc1` |
| `byArtist` | by artist | proposed | `0x13d5d4ad6ae3a4e1b5043141b6ce4633c2df4646eaefc9e45eba899c45ce235b` |
| `certifiedBy` | certified by | proposed | `0x9d30f5065f64ccad286b8bf5d506039022146e1bfaf6877bb774a8c8c29a27f8` |
| `citedBy` | cited by | proposed | `0xb9c12eaf5fb5c952ec1a25d993f49e8dc5027708d02bcb47ab077c02930a6d35` |
| `compatibleWith` | compatible with | proposed | `0x7cc0975a6e368c14bf4b64d33befd656b6091ba7a4686d4a8e250b39e43d475d` |
| `competeWith` | compete with | proposed | `0x9ec407d56a32528625f3682bce413fc56d60659b7124aa75e12df30538e255a4` |
| `compliantWith` | compliant with | proposed | `0xeefc74ba0ee80333e479971791542a1db8b90ccf72c0c2fcd51e73f50cb45d64` |
| `confirmedBy` | confirmed by | proposed | `0x0f9fb9c6c471eab616ee164bd2d77e3a3913309a062e533cf3d5051b2678ef52` |
| `contain` | contain | enshrined | `0xa64ca3a04b63c5f6b94ba65b11a1a197767e68cca1f41ac563b5f2d34fa36597` |
| `containedInPlace` | contained in place | proposed | `0x5a26a9bd3ae73815e33de43ff44356bd60b19ed3fb243023d4318def9ce620fc` |
| `containsPlace` | contains place | proposed | `0x39ec6c00d1c5bb25a68ea6e4d6baa5faebecd6314f1cb4c5b28069d696864395` |
| `contributedTo` | contributed to | proposed | `0x88a77127ef88a3abe7130b47a11e90b1ddad8c66a36c6cc9456688143ee8977a` |
| `createdBy` | created by | enshrined | `0x3df2eaf3b9bdaf2018bc5d45fa770c470ab5067b5afdc9e3097151f9c87d92a4` |
| `curatedBy` | curated by | enshrined | `0x0eeaeab1a9342622fe04b414f1bbb75d9528f491cdd1568bb7b08d708087d7bf` |
| `delegatedTo` | delegated to | proposed | `0x8c1b63581f8f3145e3909c2185bf58ee971256c856519f9bdcc812a95a8f64b9` |
| `dependOn` | depend on | proposed | `0xc74aa2d983b42f73f0114e775b6b9442fde072c7f3448cc01ced338e61532ce6` |
| `deprecatedBy` | deprecated by | proposed | `0xd52897e940e8b03a17259ded4810b96212522ad42f62ad477d26749343b0e969` |
| `derivedFrom` | derived from | proposed | `0xdaf3c3887d1b2b1056ff27fb2f7f37dcdc2bc63f5f15cc2f7f5c111a4de0180c` |
| `director` | director | proposed | `0xb5615fb82280ab71bcd06493b5028a5909b09288230a7eade6765b1095686c88` |
| `disagreeWith` | disagree with | enshrined | `0x772b057c1fd361e76277b4295593a58da8a1546663400f719e7aa7e65ae222be` |
| `disputedBy` | disputed by | proposed | `0xc612acf846c25ad4241856dc8ceceeb3fce64357dd566e0caa4295b9974172c0` |
| `distrust` | distrust | enshrined | `0x5ff9d7c79cd3741fbc3f1edc73e2a5b8f91ea168b26947208cfc652fd674b248` |
| `employedBy` | employed by | proposed | `0x89968d0be91dc584b7747967541df3947129cb107b5fb97e79a4c8305eb2356e` |
| `enabledBy` | enabled by | proposed | `0x4e3a3e2022c34f648b2e458b4d3b8c81a0d9b93b5abaaed75d8604c4053c180f` |
| `endorse` | endorse | enshrined | `0x96c6e6de8d0ba084aa0b4c09950ea583d30cd5e4a46fc396f2895f4c7add86e4` |
| `equivalentTo` | equivalent to | proposed | `0x4c8820a3facf2bb8ed499a01dce9e5367363024166ff42bff0ebb19829d2f1e9` |
| `evidencedBy` | evidenced by | proposed | `0xc21b0f944e2882cd9e0c1cf6a1622a9e2df2ee84b4e7d1c4ae9d9ac08fd94db2` |
| `expertIn` | expert in | proposed | `0x4c286cc4064a358fed817e4f6b46ad43869eac7d6707587f9f66bab78ca5ece5` |
| `featuredIn` | featured in | proposed | `0x04a664927399b5a46320379d93b7102bcc1c80e2cebbcca0df26e848e0883120` |
| `follow` | follow | enshrined | `0x1d38401c1cd1d0b21215754554b3dae60fb626e760cf7b99162e25baf16464b6` |
| `followedBy` | followed by | proposed | `0x35e89692464035516a04e156d1527898a04cd0db37684ac159af2525edc88864` |
| `forkedFrom` | forked from | proposed | `0x641c5045928c2acb595c20421fa67b8a8d7ebba7e3d73d913e3ca5db9ee5fb7c` |
| `founded` | founded | proposed | `0xcbcfeb175813f275b952eb9df762bef10fe90e16bc8bbc1b1b21a2565b7ad16b` |
| `founder` | founder | proposed | `0x12798cbb0392c40e4e46c692ee94c7345032a9a4970e26c4821920cd12832591` |
| `governedBy` | governed by | proposed | `0x3faa6781f4475e91fecce9a5aba7fbb9b31bbacdb1e3d6313ec353764d75a21f` |
| `hasCategory` | has category | enshrined | `0xbf037cebba059cbb9547b784b0f667db03f08c177fc0f94c0f734cf16cdc0fa8` |
| `hasDescription` | has description | enshrined | `0x7026ee74d00fc4bc448cf761b239defe0165b0c5b7be2532adb5b8acae612ab4` |
| `hasSource` | has source | proposed | `0xbc4438d7673da79765cc523da63f715c42977c894211df31fedfbdd94bccef52` |
| `hasTag` | has tag | enshrined | `0x137f29ea8a0422c9d1003ece2e1883e916d4a106da0a897279842ffbb793229a` |
| `hasType` | has type | enshrined | `0x0cda9787096fd9b22a93a874bf6400b084b6db166c7125a9e367c195b82efc87` |
| `hiringOrganization` | hiring organization | proposed | `0x4f4e416a2d225af561b4e119c1c6141700b2367ba4083ea6a4841a8e72273be3` |
| `imgUrl` | imgUrl | enshrined | `0x9f2f3089c1f61cae97bc0a50bb199854489df1971641336f9247395131eaba2f` |
| `implement` | implement | proposed | `0xfdcee9a5a6150ffa458518d0f1b50eeed5f42b6aee269aab71d00d869d6fbbd1` |
| `inAlbum` | in album | proposed | `0xcd71dd2209ab6efb055c4545edcdbc8410f289a932a94410014b2021543b4168` |
| `inPlaylist` | in playlist | proposed | `0x856778688c9df8fb8be4fd949a52269b3aecfeb980d948e6fe362f8adba789d6` |
| `inspiredBy` | inspired by | proposed | `0x358bba81484329400267a570e59d4f18ff1f7b7be825cc58033b2907b6dd39ca` |
| `investedIn` | invested in | proposed | `0xb4ce45225753661c85c34af84e1e4351bfffd954796cdf9171aa36b5cafe5d6b` |
| `itemReviewed` | item reviewed | proposed | `0x483aae34762186dd047937e9571b79f01378d9ace06c5a79ce4a31708c9546c6` |
| `jobLocation` | job location | proposed | `0x5ff8390f622a4bf6a22f3108f2879c53255ff874e6699d70b03a740ee10757f0` |
| `learnedFrom` | learned from | proposed | `0x72e820cf62bac4cea99d2cc625f407587802749777a111f63561582dea43bc87` |
| `like` | like | enshrined | `0x2a170ce8fff3808d661ae553f3e65be637391ca4f48e6208f01dae0f6c0a72e7` |
| `linkedAccount` | linked account | enshrined | `0xd8a32acc6237ab21be285953b01508c7a22f523bf122aa3ab044b21d266c2c6c` |
| `listedIn` | listed in | enshrined | `0x60669cfacc52e65837ecbd0ed02748075d00f6de64b0c9e3f2f97878fb5f6720` |
| `listedOn` | listed on | proposed | `0x3733d2a7feec6156531fbd7390ac494d6764a8a8ea50abae0963806d19d34ce4` |
| `locatedIn` | located in | proposed | `0x165f0f2f51314106e280a6e6a828dda617322e7ee861dfcdad42f3f1faf7c781` |
| `manufacturer` | manufacturer | proposed | `0x33138cc38f644287fbf03a4d06dc4c83ff7b64d7679f9239d3c7a35cc73e4f2a` |
| `memberOf` | member of | proposed | `0x4650825f3c0dfa4c4faef53e4ebb3de556ae356a4c1b1265de684766690a9c99` |
| `mentorOf` | mentor of | proposed | `0xec25295b81a492462c66ae42b704acece2b74b0cd3266a2227b4feadb97ed800` |
| `musicBy` | music by | proposed | `0xa4cc82010b7010b1e13216885213a43204b6cef007118aff8571cd5b574578c9` |
| `musicGroupMember` | music group member | proposed | `0xdd76a1d3493af1c7025099650ae515cc1ad12a0e5d44be82d6a436dc790e61ef` |
| `neutralOn` | neutral on | proposed | `0x0f9d3a6d741aa83df8f188fbfb1a94a2670658c77413f599985822362debbc26` |
| `oppose` | oppose | proposed | `0xba04c796c6772430d4db6aa5266617549cedabdeb9d95307eb0a5872d64016ed` |
| `organizer` | organizer | proposed | `0xfd41828cda1bfc93e82b9c99488e9a8de74496a195c67ae7419facae3c41c12f` |
| `outperform` | outperform | proposed | `0xb8f02c433f9c95f1e481b69f931081cd00a216b4db8bd1249b5046ba16d4c1c9` |
| `parentItem` | parent item | proposed | `0x26cb448e9daa4e54f247033c2b40741153f1b2b8ae2bd13033920c389314ee36` |
| `parentOrganization` | parent organization | proposed | `0x5d93f5ba8db84190cc557cc9288caf032206e9c880c9a16e5333af2067fdc59c` |
| `partOfSeries` | part of series | proposed | `0xe8cbe7b41fa96e8057cdbe5283041981ba4c9fd050e13d357723979d5ae9568d` |
| `partnerOf` | partner of | proposed | `0xd78f22cc525f5b854030b12094282f808edfde68ada47cd6a4584fbcc7114172` |
| `peggedTo` | pegged to | proposed | `0xc6024b302f5e90a1868c638b99406329f8703b3d939d8fddf09add01ef674caf` |
| `performer` | performer | proposed | `0xfcf209b610d68918af7dac25c3d568eb769af4d71e9f750caec0e25679a6adb2` |
| `photo` | photo | proposed | `0xc67ee43bb6473c136a9f1dd9738c4da52a1d6262850c2f02b68063a00f90050e` |
| `pinnedIn` | pinned in | proposed | `0xe85518b66264af0f9619ed2b71cfb6bfd07aa94aa6998a0c31d0e8f1fa00eea1` |
| `precededBy` | preceded by | proposed | `0x2bbefd639437c5066574656305d5876ce3c0954a511b203366095c6c9bb491f7` |
| `predecessorOf` | predecessor of | proposed | `0x0e79b08fc40e4904a66487564dcdf6b55c03603e3dab1259d24c85b46a94b094` |
| `pricedIn` | priced in | proposed | `0x625fe16917efdec30f6ffe606ffefe17a504204a1022b3e62911c547aa5da641` |
| `primaryImageOfPage` | primary image of page | proposed | `0xe47ef05689a28a9948800c60596a69d7a7b52c177367d31d7f71ba33bc738f76` |
| `productionCompany` | production company | proposed | `0xb2a18c47b1fd2be0471997279089c2c0b2b7bdda39ee01b9f511e16081712a78` |
| `proposed` | proposed | proposed | `0xe6c566dbf26b130e64b46e975f7a8fea1d642265d16997e26e78d0e6a0f7019d` |
| `provider` | provider | proposed | `0x43c466f69c3efcc05d623c8398de358b205c0de59e7785a143db51172f69c79a` |
| `publishedAt` | published at | proposed | `0xff6aaa0a1dd670cfa32a03a5b0720c6d0fdee7919fa9aea22a40bcdbc80514be` |
| `publisher` | publisher | proposed | `0x1b3ba08e8f437a820dce9077ed0f5b853bc7c4ddc46bb3961dc9a902180ac90b` |
| `rankedAbove` | ranked above | proposed | `0xad2cf8c1b6a55e3a820cf993f6de90dd8aa03a77c850e62c2910f3e8e26bc838` |
| `recommend` | recommend | enshrined | `0x18d0a4b84c6c454e800da8e120d320a953be5946d74f069b74d87b80105cb69c` |
| `reference` | reference | proposed | `0x8cf728a7f310d0c370911dd8aed25392de51010342d688259fdf1e7193dd2ad3` |
| `regulatedBy` | regulated by | proposed | `0xa699796fe030cd54bec84c17883cfdf9805721306e6e2408d3f8516ae6fd31f4` |
| `replacedBy` | replaced by | proposed | `0x87cfb9ef0491c4823a57e9f61c1c705a0d2030b44bc0a08839c1a32510141ca7` |
| `reported` | reported | proposed | `0x5fe378a93a7c49acb9e4e520a72622f55ce5973d73912a1c52457d5baddbd24a` |
| `reviewed` | reviewed | proposed | `0x48007c0b9905a0ff8016431514d5b19b80eb7e0fa419fab38698e5aae5dc8d84` |
| `reviewedBy` | reviewed by | proposed | `0x28e649797ca059be09c524658e3b48bb9e05826e4679b0d6c3b53b613ba617d0` |
| `reward` | reward | proposed | `0x9676c7e45df5439028aaa4c806cc76b0d85b5323d06e1f7ef7541976d322950f` |
| `sameAs` | same as | enshrined | `0x1908b7994ca437c84c67a4799ae710355591790a726bf5890277f3aa70828c0a` |
| `skepticalOf` | skeptical of | proposed | `0x4a6b6a82c5d856ad0423caa6a6d666d8d4a538c6adbda5e4b0ba9a22c1affb4c` |
| `softwareAddOn` | software add on | proposed | `0x5e264c12e3d97061d9c9562f296ae1f31b806fd90cddd5a7cddd8e0f17008bee` |
| `speak` | speak | proposed | `0x3b88a7126919144737aa27e192e1b1e3ce120a301dbe37e36381df59f551f1cc` |
| `sponsoredBy` | sponsored by | proposed | `0x80d43f1c53058ddeba0daea68c239900133bc08ff1dec845c424190ff36c5f9e` |
| `stakedIn` | staked in | proposed | `0xda9df47c6c34d2006bfe6e2a7faf5bef5fe72dcab0c6e01b9be377fac5cd6dbf` |
| `studentOf` | student of | proposed | `0xe6486e0a020bd559a4638e03dbd20806d61f197036a818d7ed002a10cb18c0a3` |
| `studied` | studied | proposed | `0x0431f21d8563fcd3eec47c7cf6570ffe590e3e5c07903200c89e29303d78d5c9` |
| `subEvent` | sub event | proposed | `0xcd49e0f14c378b8156a4b9cc583ae5bd539491c38e17be66285b08fd63be9c2f` |
| `subOrganization` | sub organization | proposed | `0xa5ab1dbf1c7c40f0961d40edc215d3b0a2666301a57a4b72b2809e69e4954991` |
| `successorOf` | successor of | proposed | `0x288c569a6e703ae9da00dddb2653bf1d2d14acd05ab798b05da8d0f62db5ba26` |
| `superEvent` | super event | proposed | `0x7fdbe6f3dfdb1c26fb35f3fcd265d7962bc25f1a18b32fec1c2d65d5897495fe` |
| `supersede` | supersede | proposed | `0x4ef2f2cb0d54a6ebdbdd7847c7b824ad0c2ef22f6b5db42f26c6f278fdc89131` |
| `support` | support | proposed | `0x6b29ed6806c39be50b60b186c689cebfd280c27936d4e4c872e785bfa151c423` |
| `targetProduct` | target product | proposed | `0x4358665d150cde6db0e40ffa4aa4715855028a775e1f67a78ef07033ee8a0cca` |
| `teach` | teach | proposed | `0x1db96ef00877d01a8f4e237c9307cda72aa1ef76ab8886e4a3b57548a6935c84` |
| `track` | track | proposed | `0x144c129178c900adc2624ed7f85313979c955266f3b4fa56bc54c55fb1855396` |
| `trailer` | trailer | proposed | `0x498107ee5d558569166098517065b028b478ffe177d1d13bc50d8251814b0ab5` |
| `triggered` | triggered | proposed | `0x2fef13ca888b1135a57a381aff5d78293402f51202f3a226a9f50ed9652af802` |
| `trust` | trust | enshrined | `0x722c865044ce8d169832545c9a47701dd8ff71ce62fa0408b70bd53842e4d443` |
| `url` | url | enshrined | `0x71dbe59780ccedf37166aa55781573d8aea463285cdfe94a5b08ed5f474613a3` |
| `use` | use | proposed | `0x746e295c01785421b2f1a311ff3a5830676e141e09e45fde962f84b2533f7af6` |
| `verifiedBy` | verified by | proposed | `0x97595b96f80f7406dc05fa0d146170c56562dbd442add8c5696361738af0b8ee` |
| `votedAgainst` | voted against | proposed | `0xbcca85ea08325e3774be5a995123c26aa11a751fd88a459bc0fddaeb72c5543a` |
| `votedFor` | voted for | proposed | `0xda78cf97d568942dae1563133b67264ca694d6f6f50e49a3a132c778cf7b1f3c` |
| `vouchFor` | vouch for | enshrined | `0xb7d48411b3c5159f6de1210a62b63a45d238df7462b181afa2e7d64d7008911d` |
| `worseThan` | worse than | proposed | `0xbd3a5761ee94d989d602dfc45ed6946d4b242746b8999aac2b67acce8a840736` |

{/* generated:end */}
