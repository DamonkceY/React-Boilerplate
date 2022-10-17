import React from 'react';

type DisplayType = 'MOBILE' | 'TABLET' | 'DESKTOP' | 'ALL';

export type RoutesType = {
  path: string;
  isPrivate: boolean;
  displayType: DisplayType;
  component: React.LazyExoticComponent<() => JSX.Element>;
  // Below are needed for nested routes
  children?: Array<RoutesType>;
  fallback?: string;
  //
}
