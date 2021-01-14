// Copyright 2017-2021 @canvas-ui/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { typesBundleForPolkadot } from '@acala-network/type-definitions';

export default typesBundleForPolkadot.spec.acala as unknown as OverrideBundleDefinition;
