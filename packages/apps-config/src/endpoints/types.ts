// Copyright 2017-2021 @canvas-ui/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface EndpointOption {
  dnslink?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  linked?: EndpointOption[];
  info?: string;
  providers: Record<string, string>;
  text: React.ReactNode;
  shortText?: React.ReactNode;
}
