// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// and @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Code, Contract, DbProps, User } from '@canvas-ui/app-db/types';
import type { VoidFn } from '@canvas-ui/react-util/types';
import type { Collection } from '@textile/threaddb';
// import { Abi } from '@polkadot/api-contract';
import type { AnyJson } from '@polkadot/types/types';

import { DbContext, getPrivateKey } from '@canvas-ui/app-db';
import { useApi } from '@canvas-ui/react-hooks';
import { nanoid } from 'nanoid';
import { useCallback, useContext } from 'react';

import keyring from '@polkadot/ui-keyring';

interface UseDb extends DbProps {
  User: Collection<User>;
  addCodeForUser: (id: string) => void;
  addContractForUser: (id: string) => void;
  createCode: (newCode: CodeFields, onSuccess?: CreateOnSuccess) => Promise<string>;
  createContract: (newContract: ContractFields, onSuccess: CreateOnSuccess) => Promise<string>;
  findCodes: () => Promise<Code[]>;
  findCodeByHash: (codeHash: string) => Promise<Code | null>;
  findCodeById: (id: string) => Promise<Code | null>;
  findContracts: () => Promise<Contract[]>;
  findContractByAddress: (address: string) => Promise<Contract | null>;
  findUser: () => Promise<User | null>;
  removeCode: (id: string) => Promise<void>,
  removeCodeForUser: (id: string) => void,
  removeContract: (address: string) => Promise<void>,
  removeContractForUser: (address: string) => void;
  updateCode: (id: string, updates: CodeFields) => Promise<string>,
  updateContract: (address: string, updates: ContractFields) => Promise<string>,
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

function newCodeId (): string {
  return nanoid(8);
}

export default function useDatabase (): UseDb {
  const { api, blockOneHash, isDevelopment } = useApi();
  const { db, identity, isDbReady } = useContext(DbContext);

  const Code = db.collection('Code') as Collection<Code>;
  const Contract = db.collection('Contract') as Collection<Contract>;
  const User = db.collection('User') as Collection<User>;

  const findUser = useCallback(
    async (): Promise<User | null> => {
      const identity = getPrivateKey();
      const result = await User.findOne({ publicKey: identity?.pubKey.toString() });

      return result || null;
    },
    [User]
  );

  const findCodes = useCallback(
    async (): Promise<Code[]> => {
      const result = Code.find({ blockOneHash, owner: isDevelopment ? identity?.pubKey.toString() : undefined });

      return result ? (await result.toArray()) : [];
    },
    [blockOneHash, identity?.pubKey, isDevelopment, Code]
  );

  const findCodeByHash = useCallback(
    async (codeHash: string): Promise<Code | null> => {
      return await Code.findOne({ blockOneHash, codeHash }) || null;
    },
    [blockOneHash, Code]
  );

  const findCodeById = useCallback(
    async (id: string): Promise<Code | null> => {
      return await Code.findOne({ id }) || null;
    },
    [Code]
  );

  const findContracts = useCallback(
    async (): Promise<Contract[]> => {
      return Contract.find({ blockOneHash, owner: isDevelopment ? identity?.pubKey.toString() : undefined }).toArray();
    },
    [blockOneHash, identity?.pubKey, isDevelopment, Contract]
  );

  const findContractByAddress = useCallback(
    async (address: string): Promise<Contract | null> => {
      return await Contract.findOne({ address }) || null;
    },
    [Contract]
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
    async ({ abi, codeHash, name, tags = [] }: CodeFields): Promise<string> => {
      if (!codeHash || !name) {
        return Promise.reject(new Error('Missing codeHash or name'));
      }

      const id = newCodeId();

      const newCode = Code.create({
        abi,
        blockOneHash,
        codeHash,
        genesisHash: api.genesisHash.toHex(),
        id,
        name,
        owner: identity?.pubKey.toString(),
        tags
      });

      await addCodeForUser(id);

      await newCode.save();

      return Promise.resolve(id);
    },
    [addCodeForUser, Code, api.genesisHash, blockOneHash, identity?.pubKey]
  );

  const updateCode = useCallback(
    async (id: string, { abi, name, tags }: CodeFields): Promise<string> => {
      const code = await Code.findById(id);

      if (code) {
        if (name) code.name = name;
        if (tags) code.tags = tags;
        if (abi) code.abi = abi;

        return code.save();
      }

      return Promise.reject(new Error('Contract does not exist'));
    },
    [Code]
  );

  const removeCode = useCallback(
    async (id: string): Promise<void> => {
      const user = await findUser();
      const existing = await findCodeById(id);
      const isOwned = user?.publicKey === existing?.owner;

      await removeCodeForUser(id);

      if (isOwned) {
        return Code.delete(id);
      }

      return Promise.resolve();
    },
    [Code, findCodeById, findUser, removeCodeForUser]
  );

  const createContract = useCallback(
    async ({ abi, address, name, tags = [] }: ContractFields): Promise<string> => {
      if (!address || !name) {
        return Promise.reject(new Error('Missing address or name'));
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

      await newContract.save();

      return Promise.resolve(address);
    },
    [addContractForUser, Contract, api.genesisHash, blockOneHash, identity?.pubKey]
  );

  const updateContract = useCallback(
    async (id: string, { name, tags }: ContractFields): Promise<string> => {
      const contract = await Contract.findById(id);

      if (contract) {
        if (name) contract.name = name;
        if (tags) contract.tags = tags;

        return contract.save();
      }

      return Promise.reject(new Error('Contract does not exist'));
    },
    [Contract]
  );

  const removeContract = useCallback(
    async (address: string): Promise<void> => {
      try {
        const user = await findUser();
        const existing = await findContractByAddress(address);
        const isOwned = user?.publicKey === existing?.owner;

        keyring.forgetContract(address);

        await removeContractForUser(address);

        if (isOwned) {
          return Code.delete(address);
        }

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(new Error(e));
      }
    },
    [Code, findContractByAddress, findUser, removeContractForUser]
  );

  return {
    User,
    addCodeForUser,
    addContractForUser,
    createCode,
    createContract,
    db,
    findCodeByHash,
    findCodeById,
    findCodes,
    findContractByAddress,
    findContracts,
    findUser,
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
