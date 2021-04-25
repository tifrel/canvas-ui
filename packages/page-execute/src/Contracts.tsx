// Copyright 2017-2021 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentProps as Props } from '@canvas-ui/react-components/types';

import { Button, ContractCard } from '@canvas-ui/react-components';
import { useAppNavigation } from '@canvas-ui/react-hooks';
import useContracts from '@canvas-ui/react-store/useContracts';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useTranslation } from './translate';

// function filterContracts (api: ApiPromise, keyringContracts: string[] = []): ContractPromise[] {
//   return keyringContracts
//     .map((address) => getContractForAddress(api, address.toString()))
//     .filter((contract): contract is Contract => !!contract);
// }

function Contracts ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { navigateTo, pathTo } = useAppNavigation();

  const { allContracts, hasContracts } = useContracts();
  // const contracts = useMemo(
  //   (): Contract[] | null => {
  //     return accounts && contractAddresses && contractAddresses
  //       .map((address): Contract | null => getContractForAddress(api, address))
  //       .filter((contract: Contract | null): boolean => !!contract) as Contract[];
  //   },
  //   [accounts, api, contractAddresses]
  // );

  return (
    <div className={className}>
      <header>
        <h1>{t(hasContracts ? 'Execute Contract' : 'No contracts available')}</h1>
        <div className='instructions'>
          {hasContracts
            ? t<string>('Call messages on instantiated contracts.')
            : (
              <>
                {t<string>('You can add an existing contract by')}
                {' '}
                <Link to={pathTo.executeAdd}>
                  {t<string>('entering its address')}
                </Link>
                {`. ${t<string>('Or instantiate from a')} `}
                <Link to={pathTo.instantiate}>
                  {t<string>('code bundle')}
                </Link>
                {'.'}
              </>
            )
          }
        </div>
      </header>
      <section>
        <div className='content'>
          {hasContracts && (
            <h3>{t<string>('Instantiated Contracts')}</h3>
          )}
          {allContracts?.map((contract): React.ReactNode => ((
            <ContractCard
              basePath={basePath}
              contract={contract}
              key={contract.address.toString()}
            />
          )))}
          <Button.Group>
            <Button
              label={t<string>('Add An Existing Contract')}
              onClick={navigateTo.executeAdd}
            />
          </Button.Group>
        </div>
      </section>
    </div>
  );
}

export default styled(React.memo(Contracts))`
  .content {
    > :not(:last-child) {
      margin-bottom: 0.9rem;
    }
  }
`;
