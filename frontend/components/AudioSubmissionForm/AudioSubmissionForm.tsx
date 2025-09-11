'use client';

import { useEffect } from 'react';
import {
  Paper,
  Stack,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { SUBMISSION_STATES } from '@/utils/config';
import { useAudioSubmission } from '@/hooks/useAudioSubmission';

import StepSource from './StepSource';
import StepInfo from './StepInfo';
import StepOutput from './StepOutput';
import StepFilters from './StepFilters';
import StepSubmit from './StepSubmit';
import { useZoomData } from '@/hooks/useZoomData';
import TopBarActions from './TopBarActions';
import FormNavigation from './FormNavigation';

export default function AudioSubmissionForm() {
  const { recordings } = useZoomData();
  const {
    activeStep,
    status,
    selectedRecording, setSelectedRecording,
    submissionState,
    handleFormSubmit,
  } = useAudioSubmission();

  useEffect(() => {
    if(selectedRecording) return;
    setSelectedRecording(recordings?.[0]);
  }, [recordings]);

  useEffect(() => {
    if (!status) return;
    notifications.show({ title: 'Status', message: status });
  }, [status]);

  return (
    <Stack gap={30}>
      <FormNavigation />
      <form onSubmit={handleFormSubmit}>
        <Paper shadow="md" withBorder p={20}>
          {submissionState !== SUBMISSION_STATES.COMPLETED && (
            <TopBarActions />
          )}

          {activeStep === 0 && (
            <StepSource />
          )}

          {activeStep === 1 && (
            <StepInfo />
          )}

          {activeStep === 2 && (
            <StepOutput />
          )}

          {activeStep === 3 && (
            <StepFilters />
          )}

          {activeStep === 4 && (
            <StepSubmit />
          )}
        </Paper>
      </form>
    </Stack>
  );
}
