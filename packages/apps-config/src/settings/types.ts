// Copyright 2017-2021 @canvas-ui/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface Option {
  info?: string;
  isDisabled?: boolean;
  isHeader?: boolean;
  shortText?: React.ReactNode;
  text: React.ReactNode;
  value: string | number;
}

export interface LinkOption extends Option {
  dnslink?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  linked?: LinkOption[];
  textBy: string;
}
