'use client'

import { useEffect } from 'react';
import { useZoomData } from '@/hooks/useZoomData';
import AudioSubmissionForm from '@/components/AudioSubmissionForm/variants/AudioSubmissionForm';
import Layout from '@/components/Layout';

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
    if (!zoomToken) return;

    handleFetchZoomRecordings();
  }, [zoomToken]);

  return (
    <Layout>
      <AudioSubmissionForm />
    </Layout>
  );
}