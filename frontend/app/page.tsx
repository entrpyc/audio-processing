'use client'

import { SegmentedControl, Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import AdvancedForm from './components/AdvancedForm';
import QuickForm from './components/QuickForm';
import { useZoomData } from './hooks/useZoomData';

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
    <Stack gap={20}>
      <Title order={1}>Audio Processing</Title>
      <SegmentedControl
        mt={40}
        fullWidth
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
  );
}