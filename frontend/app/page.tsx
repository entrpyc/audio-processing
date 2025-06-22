'use client'

import { Container, SegmentedControl, Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import AdvancedForm from './components/AdvancedForm';
import { ZoomRecording } from './types/types';
import QuickForm from './components/QuickForm';

export default function Home() {
  const [value, setValue] = useState('quick');
  const [zoomToken, setZoomToken] = useState<string>();
  const [recordings, setRecordings] = useState<ZoomRecording[]>([]);

useEffect(() => {
  const fetchToken = async () => {
    const res = await fetch('https://audio-processing.indepthwebsolutions.com/api/zoom-token');
    const data = await res.json();
    
    if (!data.error) {
      setZoomToken(data.zoomToken);
    }
  };

  fetchToken();

  const interval = setInterval(fetchToken, 10 * 60 * 1000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const fetchRecordings = async () => {
      const res = await fetch('https://audio-processing.indepthwebsolutions.com/api/recordings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ zoomToken }),
      });
      const data = await res.json();
      
      if(data.error) return;

      setRecordings(data.recordings?.filter((rec: ZoomRecording) => Boolean(rec.downloadUrl)) || []);
    }

    if(zoomToken) fetchRecordings();
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
            value={value}
            onChange={setValue}
            data={[
              { label: 'Quick Submission', value: 'quick' },
              { label: 'Advanced Submission', value: 'advanced' },
            ]}
          />
          {value === 'quick' ? (
            <QuickForm recordings={recordings} zoomToken={zoomToken} />
          ): (
            <AdvancedForm recordings={recordings} zoomToken={zoomToken} />
          )}
        </Stack>
      </Container>
    </main>
  );
}