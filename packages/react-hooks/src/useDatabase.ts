// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// and @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Code, Contract, DbProps, User } from '@canvas-ui/app-db/types';
import type { Collection } from '@textile/threaddb';

import { DbContext } from '@canvas-ui/app-db';
import { useContext } from 'react';

interface UseDb extends DbProps {
  Code: Collection<Code>;
  Contract: Collection<Contract>;
  User: Collection<User>;
}

export default function useApi (): UseDb {
  const { db, isDbReady } = useContext(DbContext);

  return {
    Code: db.collection('Code') as Collection<Code>,
    Contract: db.collection('Contract') as Collection<Contract>,
    User: db.collection('User') as Collection<User>,
    db,
    isDbReady
  };
}
