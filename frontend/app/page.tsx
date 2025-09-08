'use client'

import { Container, SegmentedControl, Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import AdvancedForm from './components/AdvancedForm';
import QuickForm from './components/QuickForm';
import { fetchToken } from './utils/zoomToken';
import { fetchRecordings } from './utils/zoomRecordings';
import { currentMonthRange, previousMonthRange } from './utils/helpers';
import { getStorage, setStorage, STORAGE_KEYS } from './utils/storage';
import { useRecordings } from './hooks/useRecordings';
import { ZoomRecording } from './types/types';

enum TABS {
  QUICK = 'QUICK',
  ADVACNED = 'ADVACNED',
}

export default function Home() {
  const { recordings, setRecordings } = useRecordings();
  const [activeTab, setActiveTab] = useState(TABS.QUICK);
  const [zoomToken, setZoomToken] = useState<string>();

  const handleZoomToken = async () => {
    const tokenRes = await fetchToken();
    setZoomToken(tokenRes);
  }

  const handleZoomRecordings = async () => {
    if(!zoomToken) return;

    const storedRecordings = JSON.parse(getStorage(STORAGE_KEYS.ZOOM_RECORDINGS) ?? '[]');

    if(storedRecordings.length) return setRecordings(storedRecordings);

    const recordingsRes = await fetchRecordings(zoomToken, currentMonthRange);
    
    if(!recordingsRes) return;

    setRecordings(recordingsRes);
    setStorage(STORAGE_KEYS.ZOOM_RECORDINGS, JSON.stringify(recordingsRes))
  }

  const handleFetchOlderZoomRecordings = async () => {
    if(!zoomToken) return false;

    const recordingsRes = await fetchRecordings(zoomToken, previousMonthRange);

    if(!recordingsRes) return false;
    
    setRecordings((rec: ZoomRecording[]) => [...rec, ...recordingsRes]);

    return true;
  }

  useEffect(() => {
    handleZoomToken();
  }, []);

  useEffect(() => {
    handleZoomRecordings();
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
        <QuickForm
          recordings={recordings}
          handleZoomRecordings={handleFetchOlderZoomRecordings}
          zoomToken={zoomToken}
        />
      ): (
        <AdvancedForm
          recordings={recordings}
          zoomToken={zoomToken}
        />
      )}
    </Stack>
  );
}