// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// and @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Code, Contract, DbProps, User } from '@canvas-ui/app-db/types';
import type { VoidFn } from '@canvas-ui/react-util/types';
import type { Collection } from '@textile/threaddb';
// import { Abi } from '@polkadot/api-contract';
import type { AnyJson } from '@polkadot/types/types';

import { DbContext } from '@canvas-ui/app-db';
import { useCallback, useContext } from 'react';

import keyring from '@polkadot/ui-keyring';

import useApi from './useApi';

interface UseDb extends DbProps {
  User: Collection<User>;
  addCodeForUser: (id: string) => void;
  addContractForUser: (id: string) => void;
  createCode: (newCode: CodeFields, onSuccess?: CreateOnSuccess) => Promise<void>;
  createContract: (newContract: ContractFields, onSuccess: CreateOnSuccess) => Promise<void>;
  findCodes: () => Promise<Code[]>;
  findContracts: () => Promise<Contract[]>;
  removeCode: (id: string, onSuccess: VoidFn) => void,
  removeCodeForUser: (id: string) => void,
  removeContract: (address: string, onSuccess: VoidFn) => void,
  removeContractForUser: (address: string) => void;
  updateCode: (id: string, updates: CodeFields, onSuccess: VoidFn) => void,
  updateContract: (address: string, updates: ContractFields, onSuccess: VoidFn) => void,
}

interface ContractFields {
  abi?: AnyJson;
  address?: string;
  name?: string;
  tags?: string[];
}

interface CodeFields {
  abi?: AnyJson,
  codeHash?: string;
  name?: string;
  tags?: string[]
}

type CreateOnSuccess = (uid: string) => () => void

export default function useDatabase (): UseDb {
  const { api, blockOneHash, isDevelopment } = useApi();
  const { db, identity, isDbReady } = useContext(DbContext);

  const Code = db.collection('Code') as Collection<Code>;
  const Contract = db.collection('Contract') as Collection<Contract>;
  const User = db.collection('User') as Collection<User>;

  const findCodes = useCallback(
    async (): Promise<Code[]> => {
      return Code.find({ blockOneHash, owner: isDevelopment ? identity?.pubKey.toString() : undefined }).toArray();
    },
    [blockOneHash, identity?.pubKey, isDevelopment, Code]
  );

  const findContracts = useCallback(
    async (): Promise<Contract[]> => {
      return Contract.find({ blockOneHash, owner: isDevelopment ? identity?.pubKey.toString() : undefined }).toArray();
    },
    [blockOneHash, identity?.pubKey, isDevelopment, Contract]
  );

  const addCodeForUser = useCallback(
    async (id: string): Promise<void> => {
      if (!identity) {
        return;
      }

      const user = await User.findOne({ publicKey: identity.pubKey.toString() });

      if (user) {
        user.codeBundles = [...new Set(user.codeBundles), id];
        await user.save();
      }
    },
    [identity, User]
  );

  const removeCodeForUser = useCallback(
    async (id: string): Promise<void> => {
      if (!identity) {
        return;
      }

      const user = await User.findOne({ publicKey: identity.pubKey.toString() });

      if (user) {
        user.codeBundles = user.codeBundles.filter((anId) => id !== anId);
        await user.save();
      }
    },
    [identity, User]
  );

  const addContractForUser = useCallback(
    async (id: string): Promise<void> => {
      if (!identity) {
        return;
      }

      const user = await User.findOne({ publicKey: identity.pubKey.toString() });

      if (user) {
        user.contracts = [...new Set(user.contracts), id];
        await user.save();
      }
    },
    [identity, User]
  );

  const removeContractForUser = useCallback(
    async (id: string): Promise<void> => {
      if (!identity) {
        return;
      }

      const user = await User.findOne({ publicKey: identity.pubKey.toString() });

      if (user) {
        user.contracts = user.contracts.filter((anId) => id !== anId);
        await user.save();
      }
    },
    [identity, User]
  );

  const createCode = useCallback(
    async ({ abi, codeHash, name, tags = [] }: CodeFields, onSuccess?: CreateOnSuccess): Promise<void> => {
      if (!codeHash || !name) {
        return;
      }

      const newCode = Code.create({
        abi,
        blockOneHash,
        codeHash,
        genesisHash: api.genesisHash.toHex(),
        name,
        owner: identity?.pubKey.toString(),
        tags
      });

      const id = newCode._id;

      await addCodeForUser(id);

      newCode.save()
        .then(onSuccess ? onSuccess(id) : undefined)
        .catch((error: any): void => {
          console.error('Unable to save code', error);
        });
    },
    [addCodeForUser, Code, api.genesisHash, blockOneHash, identity?.pubKey]
  );

  const updateCode = useCallback(
    async (id: string, { name, tags }: CodeFields, onSuccess?: () => void) => {
      const code = await Code.findById(id);

      if (code) {
        if (name) code.name = name;
        if (tags) code.tags = tags;

        await code.save();

        onSuccess && onSuccess();
      }
    },
    [Code]
  );

  const removeCode = useCallback(
    async (id: string, onSuccess: () => void) => {
      await removeCodeForUser(id);

      await Code.delete(id);

      onSuccess && onSuccess();
    },
    [Code, removeCodeForUser]
  );

  const createContract = useCallback(
    async ({ abi, address, name, tags = [] }: ContractFields, onSuccess?: CreateOnSuccess): Promise<void> => {
      if (!address || !name) {
        return;
      }

      const newContract = Contract.create({
        abi,
        address,
        blockOneHash,
        genesisHash: api.genesisHash.toHex(),
        name,
        owner: identity?.pubKey.toString(),
        tags
      });

      keyring.saveContract(address, {
        contract: {
          abi: abi || undefined,
          genesisHash: api.genesisHash.toHex()
        },
        name,
        tags: []
      });

      await addContractForUser(address);

      newContract.save()
        .then(onSuccess ? onSuccess(address) : undefined)
        .catch((error: any): void => {
          console.error('Unable to save code', error);
        });
    },
    [addContractForUser, Contract, api.genesisHash, blockOneHash, identity?.pubKey]
  );

  const updateContract = useCallback(
    async (id: string, { name, tags }: ContractFields, onSuccess: () => void) => {
      const contract = await Contract.findById(id);

      if (contract) {
        if (name) contract.name = name;
        if (tags) contract.tags = tags;

        await contract.save();

        onSuccess && onSuccess();
      }
    },
    [Contract]
  );

  const removeContract = useCallback(
    async (address: string, onSuccess: () => void) => {
      await removeContractForUser(address);

      await Code.delete(address);

      onSuccess && onSuccess();
    },
    [Code, removeContractForUser]
  );

  return {
    User,
    addCodeForUser,
    addContractForUser,
    createCode,
    createContract,
    db,
    findCodes,
    findContracts,
    identity,
    isDbReady,
    removeCode,
    removeCodeForUser,
    removeContract,
    removeContractForUser,
    updateCode,
    updateContract
  };
}
