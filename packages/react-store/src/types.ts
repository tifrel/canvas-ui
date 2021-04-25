// Copyright 2017-2021 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Moved from @canvas-ui/apps -> react-store

import type { Code, Contract as ContractDocument } from '@canvas-ui/app-db/types';
import type { VoidFn } from '@canvas-ui/react-util/types';
import type { ContractPromise } from '@polkadot/api-contract';

export interface Contract {
  document: ContractDocument,
  api: ContractPromise
}

export interface UseCodes {
  allCodes: Code[];
  hasCodes: boolean;
  isLoading: boolean;
  refreshCodes: VoidFn;
  updated: number;
}

export interface UseContracts {
  allContracts: Contract[];
  fetchContract: (_: string) => Promise<Contract | null>;
  hasContracts: boolean;
  isContract: (_: string) => Promise<boolean>;
  isLoading: boolean;
  refreshContracts: VoidFn;
  updated: number;
}
