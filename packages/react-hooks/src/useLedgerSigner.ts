// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// and @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { registry } from '@canvas-ui/react-api';
import { Ledger } from '@polkadot/ui-keyring';

import { Signer, SignerResult } from '@polkadot/api/types';
import { createType } from '@polkadot/types';
import { SignerPayloadJSON } from '@polkadot/types/types';

let id = 0;

class LedgerSigner implements Signer {
  private ledger: Ledger
  constructor(ledger: Ledger) {
      this.ledger = ledger;
  }
  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const raw = createType(registry, 'ExtrinsicPayload', payload, { version: payload.version });
    const { signature } = await this.ledger.sign(raw.toU8a(true));
    return { id: ++id, signature };
  }
}

const ledgerSigner = new LedgerSigner();

export default ledgerSigner;