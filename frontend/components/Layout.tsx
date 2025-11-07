'use client'

import { AppShell } from '@mantine/core';
import { Navbar } from '@/components/Navbar';
import { useTheme } from '@/hooks/useTheme';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode[] | ReactNode }) {
  const { isDesktop } = useTheme();

  return (
    <AppShell
      padding={{ base: 'md', sm: 'xl' }}
      navbar={{ width: 280, breakpoint: 'sm' }}
      footer={!isDesktop ? { height: 64 } : undefined}
    >
      {isDesktop && (
        <AppShell.Navbar>
          <Navbar />
        </AppShell.Navbar>
      )}

      <AppShell.Main pb={{ base: 80, sm: 'xl' }}>
        {children}
      </AppShell.Main>

      {!isDesktop && (
        <AppShell.Footer p="xs" style={{ position: 'sticky', bottom: 0 }}>
          <Navbar variant="mobile" />
        </AppShell.Footer>
      )}
    </AppShell>
  );
}