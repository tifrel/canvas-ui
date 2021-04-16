// Copyright 2017-2021 @canvas-ui/app-db authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PrivateKey } from '@textile/hub';
import type { AnyJson } from '@polkadot/types/types';

import { Database } from '@textile/threaddb';

export interface DbProps {
  db: Database;
  identity: PrivateKey | null;
  isDbReady: boolean;
}

export interface User {
  codeBundles: string[];
  contracts: string[];
  publicKey: string,
  email?: string,
  name?: string
}

export interface Code {
  blockOneHash?: string;
  codeHash: string;
  genesisHash: string;
  abi?: AnyJson | null
  name: string;
  owner?: string;
  tags?: string[];
}

export interface Contract {
  abi: AnyJson;
  address: string;
  blockOneHash?: string;
  genesisHash: string;
  name: string;
  owner?: string;
  tags?: string[];
}
