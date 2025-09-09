'use client'

import { AppShell, Container } from '@mantine/core';
import { useEffect } from 'react';
import AdvancedForm from '@/components/AdvancedForm';
import { useZoomData } from '@/hooks/useZoomData';
import { Navbar } from '@/components/Navbar';

export default function Home() {
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
      padding="xl"
      // navbar={{
      //   width: 320,
      //   breakpoint: 'sm',
      // }}
    >      
      {/* <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar> */}
      
      <AppShell.Main>
        <Container size="xl">
          <AdvancedForm />
        </Container>
      </AppShell.Main>
    
    </AppShell>
  );
}