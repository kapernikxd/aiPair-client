import type { ComponentType } from 'react';

export function observer<P>(Component: ComponentType<P>): ComponentType<P> {
  return Component;
}
