// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import styled from 'styled-components';

import Button from '../../../react-components/src/Button';
import Modal from '../../../react-components/src/Modal/index';
/* import { useToggle } from '@polkadot/react-hooks'; */

import OnboardingAbout from './OnboardingAbout';
import OnboardingUpload from './OnboardingUpload';
import OnboardingDeploy from './OnboardingDeploy';
import OnboardingExecute from './OnboardingExecute';

interface Props {
  className?: string
}

const OnboardingStep = (step: number):React.ReactNode | null => {
  switch (step) {
    case 0:
      return (
        <OnboardingAbout />
      );

    case 1:
      return (
        <OnboardingUpload />
      );

    case 2:
      return (
        <OnboardingDeploy />
      );

    case 3:
      return (
        <OnboardingExecute />
      );

    default:
      return null;
  }
};

const Onboarding = ({ className }:Props):React.ReactElement => {
/*   const [isOpen, toggleIsOpen, setIsOpen] = useToggle(); */
  const onboardingVisible = localStorage.getItem('onboardingVisible');
  const [modalClosed, setModalClosed] = useState(onboardingVisible === 'false');
  const [step, setStep] = useState(0);

  if (onboardingVisible === null) {
    localStorage.setItem('onboardingVisible', 'true');
    setModalClosed(false);
  }

  const handleCancel = () => {
    setModalClosed(true);
    localStorage.setItem('onboardingVisible', 'false');
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const StepCounter = () => {
    const steps = [];

    for (let i = 0; i < 4; i++) {
      steps.push(<div
        className={`step-circle ${step === i ? 'active' : ''}`}
        key={`indicator${i}`}
      />);
    }

    return (
      <div className='steps-counter'>{steps}</div>
    );
  };

  return (
    <>
      {!modalClosed &&
        <Modal className={className}>
          {OnboardingStep(step)}
          <StepCounter/>
          <Button.Group
            className='btn-group'
          >
            <Button
              label={step === 0 ? 'Skip intro' : 'Back'}
              onClick={step === 0 ? handleCancel : handleBack}
            />
            <Button
              isPrimary
              label={step < 3 ? 'Next' : 'Let\'s go'}
              onClick={step < 3 ? handleNext : handleCancel}
            />
          </Button.Group>
        </Modal>
      }
    </>
  );
};

export default styled(Onboarding)`
  height: 320px;

  &.visible.transition {
    display: flex !important;
    flex-direction: column;
  }

  .content {
    flex-grow: 1;
  }

  .steps-counter {
    display: flex;
    justify-content: center;
  }

  .step-circle {
    width: 8px;
    height: 8px;
    margin: 0 3px;
    border-radius: 50%;
    background-color: var(--grey40);
    transition: background-color 1s linear;

    &.active {
      background-color: var(--grey60);
    }
  }

  .btn-group {
    text-align: right;
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
`;
