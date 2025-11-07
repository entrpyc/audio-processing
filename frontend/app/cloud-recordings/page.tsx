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
    handleFetchZoomRecordings();
  }, [zoomToken]);

  return (
    <Layout>
      <AudioSubmissionForm />
    </Layout>
  );
}