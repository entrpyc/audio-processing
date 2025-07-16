'use client'

import { Container, SegmentedControl, Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import AdvancedForm from './components/AdvancedForm';
import { ZoomRecording } from './types/types';
import QuickForm from './components/QuickForm';
import { fetchToken } from './utils/zoomToken';
import { fetchRecordings } from './utils/zoomRecordings';

enum TABS {
  QUICK = 'QUICK',
  ADVACNED = 'ADVACNED',
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(TABS.QUICK);
  const [zoomToken, setZoomToken] = useState<string>();
  const [recordings, setRecordings] = useState<ZoomRecording[]>([]);

  const handleZoomToken = async () => {
    const tokenRes = await fetchToken();
    setZoomToken(tokenRes);
  }

  const handleZoomRecordings = async () => {
    if(!zoomToken) return;

    const recordingsRes = await fetchRecordings(zoomToken);
    setRecordings(recordingsRes);
  }

  useEffect(() => {
    handleZoomToken();
  }, []);

  useEffect(() => {
    handleZoomRecordings();
  }, [zoomToken])

  return (
    <main>
      <Container p={40}>
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
            <QuickForm recordings={recordings} zoomToken={zoomToken} />
          ): (
            <AdvancedForm recordings={recordings} zoomToken={zoomToken} />
          )}
        </Stack>
      </Container>
    </main>
  );
}