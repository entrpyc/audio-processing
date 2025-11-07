'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  TextInput,
  Button,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { SUBMISSION_STATES } from '@/utils/config';
import { useAudioSubmission } from '@/hooks/useAudioSubmission';
import StepSource from '../StepSource';
import StepInfo from '../StepInfo';
import StepOutput from '../StepOutput';
import StepFilters from '../StepFilters';
import StepSubmit from '../StepSubmit';
import { useZoomData } from '@/hooks/useZoomData';
import TopBarActions from '../TopBarActions';
import FormNavigation from '../FormNavigation';

export default function AudioSubmissionForm() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { recordings } = useZoomData();
  const {
    activeStep,
    status,
    selectedRecording, setSelectedRecording,
    submissionState,
    handleFormSubmit,
  } = useAudioSubmission();

  useEffect(() => {
    if (selectedRecording) return;
    setSelectedRecording(recordings?.[0]);
  }, [recordings]);

  useEffect(() => {
    if (!status) return;
    notifications.show({ title: 'Status', message: status });
  }, [status]);

  // Password gate
  if (!authenticated) {
    const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (password === 'sheafyard2025') {
        setAuthenticated(true);
        setError('');
      } else {
        setError('Wrong password');
      }
    };

    return (
      <Stack
        align="center"
        justify="center"
        style={{ height: '100vh' }}
      >
        <Paper shadow="md" p={40} withBorder style={{ width: 300 }}>
          <form onSubmit={handlePasswordSubmit}>
            <TextInput
              label="Enter password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              autoFocus
            />
            {error && (
              <Text c="red" size="sm" mt="sm">
                {error}
              </Text>
            )}
            <Button fullWidth mt="md" type="submit">
              Enter
            </Button>
          </form>
        </Paper>
      </Stack>
    );
  }

  // Once authenticated, render the actual form
  return (
    <Stack gap={30}>
      <FormNavigation />
      <form onSubmit={handleFormSubmit}>
        <Paper shadow="md" withBorder p={20}>
          {submissionState !== SUBMISSION_STATES.COMPLETED && <TopBarActions />}

          {activeStep === 0 && <StepSource />}
          {activeStep === 1 && <StepInfo />}
          {activeStep === 2 && <StepOutput />}
          {activeStep === 3 && <StepFilters />}
          {activeStep === 4 && <StepSubmit />}
        </Paper>
      </form>
    </Stack>
  );
}
