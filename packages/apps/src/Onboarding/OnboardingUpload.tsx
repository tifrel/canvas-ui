// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
/* import { useSpring, animated } from 'react-spring'; */

import Modal from '../../../react-components/src/Modal/index';

const IntroUpload = ():React.ReactElement => {
  /* const fade = useSpring({ from: { opacity: 0 }, opacity: 1 }); */

  return (
    <Modal.Content>
      {/* <animated.div
        style={fade}
      > */}
      <h2>Upload</h2>
      <p>After having tested and built your contract, you’re ready to upload the generated WebAssembly file on the Canvas chain. In the upload section you can also add the generated metadata.json file as an ABI.</p>
      <p>A unique code hash identifies the code put on chain so that duplications of the same code on chain can be avoided. You can add an already existing code bundle to the UI by pasting its unique code hash.</p>
      {/* </animated.div> */}
    </Modal.Content>
  );
};

export default IntroUpload;
