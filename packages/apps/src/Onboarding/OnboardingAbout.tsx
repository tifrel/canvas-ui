// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Modal from '../../../react-components/src/Modal/index';

const IntroAbout = ():React.ReactElement => {
  return (
    <Modal.Content>
      <h2>About Canvas smart contracts</h2>
      <p>This quick intro will take you through the working flow of uploading, deploying and interacting with smart contracts via the Canvas UI.</p>
      <p>You will need to have a built contract ready to upload. If you’re new to ink! smart contracts, check out the&nbsp;
        <a href='https://substrate.dev/substrate-contracts-workshop/'
          rel='noopener noreferrer'
          target='blank'>tutorial on the Substrate Developer Hub.</a></p>
    </Modal.Content>
  );
};

export default IntroAbout;
