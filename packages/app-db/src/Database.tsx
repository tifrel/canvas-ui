// Copyright 2017-2021 @canvas-ui/app-db authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyInfo } from '@textile/hub';
import type { DbProps } from './types';

import { PrivateKey } from '@textile/crypto';
import { Database as DB } from '@textile/threaddb';
import { ThreadID } from '@textile/threads-id';
import React, { useEffect, useMemo, useState } from 'react';

import DbContext from './DbContext';
import { code, contract, user } from './schemas';

interface Props {
  children: React.ReactNode;
  rpcUrl: string;
}

const USER_IDENTITY_KEY = 'user-identity';

export function getPrivateKey (): PrivateKey {
  let idStr = window.localStorage.getItem(USER_IDENTITY_KEY);

  if (idStr) {
    return PrivateKey.fromString(idStr);
  } else {
    const id = PrivateKey.fromRandom();

    idStr = id.toString();
    window.localStorage.setItem(USER_IDENTITY_KEY, idStr);

    return id;
  }
}

function isLocalNode (rpcUrl: string): boolean {
  return !rpcUrl.includes('127.0.0.1');
}

async function initDb (rpcUrl: string, isRemote = false): Promise<[DB, PrivateKey | null]> {
  const db = await new DB(
    rpcUrl,
    { name: 'User', schema: user },
    { name: 'Contract', schema: contract },
    { name: 'Code', schema: code }
  ).open(1);
  const identity = getPrivateKey();

  if (isRemote && !isLocalNode(rpcUrl)) {
    try {
      if (!process.env.HUB_API_KEY || !process.env.HUB_API_SECRET) {
        throw new Error('No Textile Hub credentials found');
      }

      const info: KeyInfo = {
        key: process.env.HUB_API_KEY,
        secret: process.env.HUB_API_SECRET
      };

      const remote = await db.remote.setKeyInfo(info);

      await remote.authorize(identity);

      const threadId = ThreadID.fromString(rpcUrl);

      await remote.initialize(threadId);
      await remote.pull('User', 'Contract', 'Code');
    } catch (e) {
      console.error(e);
    }
  }

  return [db, identity];
}

function Database ({ children, rpcUrl }: Props): React.ReactElement<Props> | null {
  // TODO: Push to remote peer db if not development/local node
  // const { chainName, isDevelopment } = useApi();

  const [db, setDb] = useState<DB>(new DB(''));
  const [identity, setIdentity] = useState<PrivateKey | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);

  const isRemote = useMemo(
    (): boolean => false, // !isDevelopment
    []
  );

  // initial initialization
  useEffect((): void => {
    async function createDb () {
      try {
        const [db, identity] = await initDb(rpcUrl, isRemote);

        setDb(db);
        setIdentity(identity);
        setIsDbReady(true);
      } catch (e) {
        console.error(e);
        setDb(new DB(''));
      }
    }

    createDb()
      .then()
      .catch((e) => console.error(e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const props = useMemo<DbProps>(
    () => ({ db, identity, isDbReady }),
    [db, identity, isDbReady]
  );

  if (!db || !props.isDbReady) {
    return null;
  }

  return (
    <DbContext.Provider value={props}>
      {children}
    </DbContext.Provider>
  );
}

export default React.memo(Database);
