import { registry } from '@canvas-ui/react-api';
import { Signer, SignerResult } from '@polkadot/api/types';
import { createType } from '@polkadot/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { KUSAMA_GENESIS, POLKADOT_GENESIS } from '@canvas-ui/app-config/api/constants';

import { Ledger } from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { assert } from '@polkadot/util';

import { api } from '../../react-api/src/Api';

const ALLOWED_CHAINS: [string, 'kusama' | 'polkadot'][] = [
    [KUSAMA_GENESIS, 'kusama'],
    [POLKADOT_GENESIS, 'polkadot']
  ];
  
let ledger: Ledger | null = null;
  
function getLedger (): Ledger {
if (!ledger) {
    const def = api && ALLOWED_CHAINS.find(([g]) => g === api.genesisHash.toHex());
    assert(def, `Unable to find supported chain for ${api.genesisHash.toHex()}`);
    ledger = new Ledger(uiSettings.ledgerConn as 'u2f', def[1]);
    }
  
    return ledger;
  }

let id = 0;

class LedgerSigner implements Signer {
  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const raw = createType(registry, 'ExtrinsicPayload', payload, { version: payload.version });
    const { signature } = await getLedger().sign(raw.toU8a(true));

    return { id: ++id, signature };
  }
}

const ledgerSigner = new LedgerSigner();