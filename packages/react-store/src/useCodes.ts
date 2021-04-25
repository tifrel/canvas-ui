// Copyright 2017-2021 @canvas-ui/react-store authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Code } from '@canvas-ui/app-db/types';
import type { UseCodes } from './types';

import { useDatabase } from '@canvas-ui/app-db';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useCodes (): UseCodes {
  const { findCodes, isDbReady } = useDatabase();
  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(0);
  const [allCodes, setAllCodes] = useState<Code[]>([]);

  const hasCodes = useMemo(
    (): boolean => allCodes.length > 0,
    [allCodes]
  );

  const fetchCodes = useCallback(
    async (): Promise<void> => {
      if (!isDbReady) return;

      setUpdated(Date.now());

      const allCodes = await findCodes();

      console.log(allCodes);

      setAllCodes(allCodes);
      setIsLoading(false);
    },
    [findCodes, isDbReady]
  );

  const refreshCodes = useCallback(
    async (): Promise<void> => {
      setIsLoading(true);

      await fetchCodes();
    },
    [fetchCodes]
  );

  useEffect(
    (): void => {
      fetchCodes().then().catch((e) => console.error(e));
    },
    // eslint-disable-next-line
    []
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
    allCodes, hasCodes, isLoading, refreshCodes, updated
  };
}
