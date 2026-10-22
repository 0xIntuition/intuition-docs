---
title: 'API client'
slug: /build/sdk-reference/api
---

Generated from the upcoming SDK **4.0.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/api`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/api/index.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## getIntuitionApiUrl

Select the built-in local, testnet, or mainnet hosted GraphQL endpoint. This is a pure URL lookup, not a Core REST connection.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/api/index.ts#L82)

```ts
function getIntuitionApiUrl(network: IntuitionApiNetwork): string;
```

## createIntuitionApiClient

Construct a read client for the hosted GraphQL schema. Its four methods return normalized atom/triple models or null for absent rows, and throw for transport or GraphQL failures.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/api/index.ts#L246)

```ts
function createIntuitionApiClient(
  config: IntuitionApiClientConfig,
): IntuitionApiClient;
```

## Input and result types

```ts
type FetchHeaders = Record<string, string>;

type FetchResponseLike = {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
  text(): Promise<string>;
};

export type FetchLike = (
  input: string,
  init?: {
    method?: string;
    headers?: FetchHeaders;
    body?: string;
  },
) => Promise<FetchResponseLike>;

export type IntuitionApiClientAuth =
  | {
      kind: 'bearer';
      token: string;
    }
  | {
      kind: 'apiKey';
      value: string;
      headerName?: string;
    };

export type IntuitionApiClientConfig = {
  baseUrl?: string;
  auth?: IntuitionApiClientAuth;
  fetch?: FetchLike;
  headers?: FetchHeaders;
};

export type IntuitionApiNetwork = 'local' | 'testnet' | 'mainnet';

export type IntuitionApiAtom = {
  termId: string;
  label: string | null;
  data: string | null;
  image: string | null;
  emoji: string | null;
  type: string | null;
};

export type IntuitionApiTermReference = {
  termId: string;
  label: string | null;
  image: string | null;
  type: string | null;
};

export type IntuitionApiTriple = {
  termId: string;
  subject: IntuitionApiTermReference;
  predicate: IntuitionApiTermReference;
  object: IntuitionApiTermReference;
};

export type IntuitionApiClient = {
  atoms: {
    getById(inputs: { termId: string }): Promise<IntuitionApiAtom | null>;
    getByLabel(inputs: { label: string }): Promise<IntuitionApiAtom | null>;
    getByData(inputs: { data: string }): Promise<IntuitionApiAtom | null>;
  };
  triples: {
    getById(inputs: { termId: string }): Promise<IntuitionApiTriple | null>;
  };
};

type GraphqlSuccess<TData> = {
  data?: TData;
  errors?: Array<{ message?: string }>;
};
```
