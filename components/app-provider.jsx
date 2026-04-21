'use client';

import { BuzzProvider } from '@/lib/buzz-state';

export function AppProvider({ children }) {
  return <BuzzProvider>{children}</BuzzProvider>;
}
