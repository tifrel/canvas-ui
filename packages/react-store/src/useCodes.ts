// Copyright 2017-2021 @canvas-ui/react-store authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Code } from '@canvas-ui/app-db/types';
import type { UseCodes } from './types';

import { useApi, useDatabase } from '@canvas-ui/react-hooks';
import { Client, PrivateKey, ThreadID, Update } from '@textile/hub';
import { useCallback, useEffect, useMemo, useState } from 'react';

import store from './store';

export default function useCodes (): WithCodes {
  const { blockOneHash, isDevelopment } = useApi();
  const { Code } = useDatabase();
  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(0);
  const [allCodes, setAllCodes] = useState<Code[]>([]);

  const hasCodes = useMemo(
    (): boolean => allCodes.length > 0,
    [allCodes]
  );

  const fetchCodes = useCallback(
    async (): Promise<void> => {
      setUpdated(Date.now());

      const allCodes = await Code.find(isDevelopment ? { blockOneHash } : {}).toArray();

      setAllCodes(allCodes);
    },
    [Code, blockOneHash, isDevelopment]
  );

  useEffect(
    (): void => {
      fetchCodes().then().catch((e) => console.error(e));
    },
    [fetchCodes]
  );

  // useEffect(
  //   (): void => {
  //     store.on('new-code', _fetchCodes);
  //     store.on('removed-code', _fetchCodes);

  //     store.loadAll()
  //       .then((): void => {
  //         setAllCodes(store.getAllCode());
  //         setIsLoading(false);
  //       })
  //       .catch((): void => {
  //         // noop, handled internally
  //       });
  //   },
  //   [_triggerUpdate]
  // );

  return {
    allCodes, hasCodes, isLoading, updated
  };
}
