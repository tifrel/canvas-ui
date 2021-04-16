// Copyright 2017-2021 @canvas-ui/app-instantiate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Code } from '@canvas-ui/app-db/types';

import { WithLoader } from '@canvas-ui/react-components';
import { AppProps as Props } from '@canvas-ui/react-components/types';
import { useDatabase, useHasInstantiateWithCode } from '@canvas-ui/react-hooks';
// import useCodes from '@canvas-ui/react-store/useCodes';
import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router';

import Add from './Add';
import Codes from './Codes';
import New from './New';
import NewFromCode from './NewFromCode';
import Success from './Success';
import { ComponentProps } from './types';

function InstantiateApp ({ basePath }: Props): React.ReactElement<Props> {
  // const { allCodes, hasCodes, isLoading, updated } = useCodes();
  const hasInstantiateWithCode = useHasInstantiateWithCode();
  const { findCodes } = useDatabase();

  const [isLoading, setIsLoading] = useState(true);
  const [allCodes, setAllCodes] = useState<Code[]>([]);
  const [updated, setUpdated] = useState(Date.now());

  useEffect(
    (): void => {
      async function loadCodes (): Promise<Code[]> {
        const codes = await findCodes();

        return codes;
      }

      loadCodes()
        .then((codes) => {
          setAllCodes(codes);
          setIsLoading(false);
          setUpdated(Date.now());
        }).catch((e) => {
          setIsLoading(false);
          console.error(e);
        });
    },
    [findCodes]
  );

  const componentProps = useMemo(
    (): ComponentProps => ({
      allCodes,
      basePath,
      hasCodes: allCodes?.length > 0,
      isLoading,
      updated
    }),
    [allCodes, basePath, isLoading, updated]
  );

  return (
    <main className='instantiate--App'>
      <WithLoader isLoading={isLoading}>
        <Switch>
          <Route path={`${basePath}/new/:id/:index?`}>
            <New {...componentProps} />
          </Route>
          {hasInstantiateWithCode && (
            <Route path={`${basePath}/new`}>
              <NewFromCode {...componentProps} />
            </Route>
          )}
          <Route path={`${basePath}/add`}>
            <Add {...componentProps} />
          </Route>
          <Route path={`${basePath}/success/:address`}>
            <Success {...componentProps} />
          </Route>
          <Route exact>
            <Codes {...componentProps} />
          </Route>
        </Switch>
      </WithLoader>
    </main>
  );
}

export default React.memo(InstantiateApp);
