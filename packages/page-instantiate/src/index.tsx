// Copyright 2017-2021 @canvas-ui/app-instantiate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WithLoader } from '@canvas-ui/react-components';
import { AppProps as Props, ComponentProps } from '@canvas-ui/react-components/types';
import { useDatabase, useHasInstantiateWithCode } from '@canvas-ui/react-hooks';
import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import Add from './Add';
import Codes from './Codes';
import New from './New';
import NewFromCode from './NewFromCode';
import Success from './Success';

function InstantiateApp ({ basePath }: Props): React.ReactElement<Props> {
  const { isDbReady } = useDatabase();
  const hasInstantiateWithCode = useHasInstantiateWithCode();

  // const [isLoading, setIsLoading] = useState(true);
  // const [allCodes, setAllCodes] = useState<Code[]>([]);
  // const [updated, setUpdated] = useState(Date.now());

  // useEffect(
  //   (): void => {
  //     async function loadCodes (): Promise<Code[]> {
  //       const codes = await findCodes();

  //       return codes;
  //     }

  //     loadCodes()
  //       .then((codes) => {
  //         setAllCodes(codes);
  //         setIsLoading(false);
  //         setUpdated(Date.now());
  //       }).catch((e) => {
  //         setIsLoading(false);
  //         console.error(e);
  //       });
  //   },
  //   [findCodes]
  // );

  const componentProps = useMemo(
    (): ComponentProps => ({
      basePath
    }),
    [basePath]
  );

  return (
    <main className='instantiate--App'>
      <WithLoader isLoading={!isDbReady}>
        <Switch>
          <Route path={`${basePath}/new/:id/:index?`}>
            <New />
          </Route>
          {hasInstantiateWithCode && (
            <Route path={`${basePath}/new`}>
              <NewFromCode />
            </Route>
          )}
          <Route path={`${basePath}/add`}>
            <Add />
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
