'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EmotionCacheProvider from './registry';
import theme from './theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <EmotionCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </EmotionCacheProvider>
    </SessionProvider>
  );
}