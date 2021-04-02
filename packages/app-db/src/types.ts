// Copyright 2017-2021 @canvas-ui/app-db authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from '@polkadot/types/types';

import { Database } from '@textile/threaddb';

export interface DbProps {
  db: Database;
  isDbReady: boolean;
}

export interface User {
  _id: string,
  publicKey: string,
  email?: string,
  name?: string
}

export interface Code {
  _id: string;
  owner: string;
  blockOneHash?: string;
  codeHash: string;
  genesisHash: string;
  abi?: AnyJson | null
  name: string;
  tags?: string[];
}

export interface Contract {
  abi: AnyJson;
  address: string;
  genesisHash: string;
  name: string;
  tags?: string[];
}
