'use client'

import { useEffect } from 'react';
import { useZoomData } from '@/hooks/useZoomData';
import AudioSubmissionForm from '@/components/AudioSubmissionForm/variants/AudioSubmissionForm';
import Layout from '@/components/Layout';

export default function Home() {
  const {
    handleFetchFullRangeZoomRecordings,
    zoomToken,
    handleZoomToken,
  } = useZoomData();

  useEffect(() => {
    handleZoomToken();
  }, []);

  useEffect(() => {
    handleFetchFullRangeZoomRecordings();
  }, [zoomToken]);

  return (
    <Layout>
      <AudioSubmissionForm />
    </Layout>
  );
}