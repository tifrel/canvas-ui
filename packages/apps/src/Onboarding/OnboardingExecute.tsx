// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
/* import { useSpring, animated } from 'react-spring'; */

import Modal from '../../../react-components/src/Modal/index';

const IntroExecute = ():React.ReactElement => {
  /* const fade = useSpring({ from: { opacity: 0 }, opacity: 1 }); */

  return (
    <Modal.Content>
      {/* <animated.div
        style={fade}
      > */}
      <h2>Execute</h2>
      <p>You can now interact with your contract on chain. The uploaded ABI provides you with messages to call.</p>
      <p>Using a contract’s unique code hash, you can also add and interact with already deployed contracts via the Canvas UI.</p>
      {/* </animated.div> */}
    </Modal.Content>
  );
};

export default IntroExecute;
