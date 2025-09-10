'use client'

import { AppShell } from '@mantine/core';
import { useEffect } from 'react';
import AudioSubmission from '@/components/AudioSubmission';
import { useZoomData } from '@/hooks/useZoomData';
import { Navbar } from '@/components/Navbar';
import { useTheme } from '@/hooks/useTheme';

export default function Home() {
  const { isDesktop } = useTheme();

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
        <AudioSubmission />
      </AppShell.Main>

      {!isDesktop && (
        <AppShell.Footer p="xs" style={{ position: 'sticky', bottom: 0 }}>
          <Navbar variant="mobile" />
        </AppShell.Footer>
      )}
    </AppShell>
  );
}