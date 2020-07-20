// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
/* import { useSpring, animated } from 'react-spring'; */

import Modal from '../../../react-components/src/Modal/index';

const IntroDeploy = ():React.ReactElement => {
/*   const fade = useSpring({ from: { opacity: 0 }, opacity: 1 }); */

  return (
    <Modal.Content>
      {/* <animated.div
        style={fade}
      > */}
      <h2>Deploy</h2>
      <p>With the code uploaded to the chain, it is time to deploy it and instantiate a contract.</p>
      <p>This quick intro will take you through the working flow of uploading, deploying and interacting with smart contracts on the Canvas chain.</p>
      {/* </animated.div> */}
    </Modal.Content>
  );
};

export default IntroDeploy;
