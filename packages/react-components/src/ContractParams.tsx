// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UseTxParams } from '@canvas-ui/react-params/types';
import { Registry } from '@polkadot/types/types';

import React from 'react';
import UIParams from '@canvas-ui/react-params';

interface Props extends UseTxParams {
  isDisabled?: boolean;
  registry?: Registry
  onEnter?: () => void;
}

function Params ({ isDisabled, onChange, onEnter, params = [], registry, values }: Props): React.ReactElement<Props> | null {
  if (!params.length) {
    return null;
  }

  return (
    <UIParams
      isDisabled={isDisabled}
      onChange={onChange}
      onEnter={onEnter}
      params={params}
      registry={registry}
      values={values}
    />
  );
}

export default React.memo(Params);
