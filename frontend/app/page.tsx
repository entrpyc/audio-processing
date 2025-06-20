'use client'

import { Container, SegmentedControl, Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import AdvancedForm from './components/AdvancedForm';
import { ZoomRecording } from './types/types';

export default function Home() {
  const [value, setValue] = useState('advanced');
  const [recordings, setRecordings] = useState<ZoomRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      const res = await fetch('https://audio-processing.indepthwebsolutions.com/api/recordings');
      const data = await res.json() as ZoomRecording[];
      setRecordings(data.filter(rec => Boolean(rec.downloadUrl)));
    }

    fetchRecordings();
  }, [])

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
            <>
              <p>Title</p>
              <p>Cloud select</p>
              <p>Send to Group</p>
            </>
          ): (
            <AdvancedForm recordings={recordings} />
          )}
        </Stack>
      </Container>
    </main>
  );
}