'use client'

import { AppShell, useMantineTheme } from '@mantine/core';
import { useEffect } from 'react';
import AdvancedForm from '@/components/AdvancedForm';
import { useZoomData } from '@/hooks/useZoomData';
import { Navbar } from '@/components/Navbar';
import { useMediaQuery } from '@mantine/hooks';

export default function Home() {
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  const {
    handleFetchZoomRecordings,
    zoomToken,
    handleZoomToken,
  } = useZoomData();

  useEffect(() => {
    handleZoomToken();
  }, []);

  useEffect(() => {
    handleFetchZoomRecordings();
  }, [zoomToken]);

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
        <AdvancedForm />
      </AppShell.Main>

      {!isDesktop && (
        <AppShell.Footer p="xs" style={{ position: 'sticky', bottom: 0 }}>
          <Navbar variant="mobile" />
        </AppShell.Footer>
      )}
    </AppShell>
  );
}