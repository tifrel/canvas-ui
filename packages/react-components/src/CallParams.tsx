// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AbiParam } from '@polkadot/api-contract/types';
import { Registry } from '@polkadot/types/types';
import { RawParams } from '@canvas-ui/react-params/types';

import React, { useCallback, useEffect, useState } from 'react';
import UIParams from '@canvas-ui/react-params';

interface Props {
  isDisabled?: boolean;
  params?: AbiParam[];
  onChange: (values: any[]) => void;
  onEnter?: () => void;
  registry?: Registry
}

function CallParams ({ isDisabled, onChange, onEnter, params: propParams, registry }: Props): React.ReactElement<Props> | null {
  const [params, setParams] = useState<AbiParam[]>([]);

  useEffect((): void => {
    propParams && setParams(propParams);
  }, [propParams]);

  const _onChange = useCallback(
    (values: RawParams) => onChange(values.map(({ value }): any => value)),
    [onChange]
  );

  if (!params.length) {
    return null;
  }

  return (
    <UIParams
      isDisabled={isDisabled}
      onChange={_onChange}
      onEnter={onEnter}
      params={params}
      registry={registry}
    />
  );
}

export default React.memo(CallParams);
