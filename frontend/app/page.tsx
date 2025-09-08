'use client'

import { AppShell, Container, SegmentedControl, Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import AdvancedForm from '../components/AdvancedForm';
import QuickForm from '../components/QuickForm';
import { useZoomData } from '../hooks/useZoomData';

enum TABS {
  QUICK = 'QUICK',
  ADVACNED = 'ADVACNED',
}

export default function Home() {
  const {
    handleFetchZoomRecordings,
    zoomToken,
    handleZoomToken,
  } = useZoomData();

  const [activeTab, setActiveTab] = useState(TABS.QUICK);

  useEffect(() => {
    handleZoomToken();
  }, []);

  useEffect(() => {
    handleFetchZoomRecordings();
  }, [zoomToken]);

  return (
    <AppShell
      padding="xl"
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
    >      
      <AppShell.Navbar>Navbar</AppShell.Navbar>
      
      <AppShell.Main>
        <Container>
          <Stack gap={20}>
            <SegmentedControl
              size="lg"
              value={activeTab}
              onChange={v => setActiveTab(v as TABS)}
              data={[
                { label: 'Quick Submission', value: TABS.QUICK },
                { label: 'Advanced Submission', value: TABS.ADVACNED },
              ]}
            />
            {activeTab === TABS.QUICK ? (
              <QuickForm />
            ): (
              <AdvancedForm />
            )}
          </Stack>
        </Container>
      </AppShell.Main>
    
    </AppShell>
  );
}