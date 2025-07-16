'use client';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import {
  Button,
  Card,
  Flex,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ZoomRecording } from '../types/types';
import css from '../style/styles.module.css';
import { APP_STATES, TELEGRAM_GROUPS, TELEGRAM_SHEAF_YARD_GROUP_ID } from '../utils/config';
import { handleZoomRecordingUpload } from '../utils/requests';

export default function QuickForm({ recordings, zoomToken }: { recordings: ZoomRecording[], zoomToken: string | undefined }) {
  const [status, setStatus] = useState('');
  const [selectedRecording, setSelectedRecording] = useState<ZoomRecording>();
  const [group, setGroup] = useState<string>(TELEGRAM_SHEAF_YARD_GROUP_ID);
  const [appState, setAppState] = useState(APP_STATES.INIT);
  const [appErrorState, setAppErrorState] = useState<boolean>(false);
  
  const fieldRefs = {
    audioFile: useRef<HTMLInputElement>(null),
    title: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
  };

  const form = useForm({
    initialValues: {
      audioFile: null as File | null,
      title: '',
      date: '',
    },

    validate: {
      title: (value) => (value ? null : 'Title is required'),
    },
  });

  const selectedDate = `${selectedRecording?.dateRaw}`;

  const handleSubmit = async () => {
    const validation = form.validate();

    if (validation.hasErrors || !selectedRecording?.downloadUrl || !zoomToken) {
      const firstErrorKey = Object.keys(validation.errors)[0] as keyof typeof fieldRefs;
      fieldRefs[firstErrorKey]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fieldRefs[firstErrorKey]?.current?.focus();
      
      return;
    }

    setAppState(APP_STATES.STARTED);
    setStatus('🚀 Uploading');
    
    try {
      const res = await handleZoomRecordingUpload({
        title: form.values.title,
        date: selectedDate,
        downloadUrl: selectedRecording?.downloadUrl,
        groupId: group,
        zoomToken,
        sendToTelegram: true,
      });

      const data = await res.json();

      if(data.error) {
        setStatus(`❌ Upload failed: ${data.error}`);
        setAppErrorState(true);
        return;
      }

      setStatus(`✅ ${data.status}`);
    } catch (err: any) {
      setStatus(`❌ Upload failed: ${err.message}`);
      setAppErrorState(true);
    } finally {
      setAppState(APP_STATES.COMPLETED);
    }
  };

  const handleGroupClick = (val: string | null) => {
    if (val && val !== group) setGroup(val);
  };

  useEffect(() => {
    setSelectedRecording(recordings[0])
  }, [recordings])

  useEffect(() => {
    if(!status) return;

    console.log(status)

    notifications.show({
      title: 'Status',
      message: status,
    })
  }, [status])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <Stack gap={40}>
        <Paper shadow="md" withBorder p={20}>
          <Stack gap={30}>
            <Title order={2}>Recording Info</Title>
            <Stack gap={10}>
              <TextInput
                disabled={appState !== APP_STATES.INIT}
                label="Title"
                ref={fieldRefs.title}
                placeholder="What should be the title of this meeting?"
                withAsterisk
                {...form.getInputProps('title')}
              />
            </Stack>
          </Stack>
        </Paper>
        
        <Paper shadow="md" withBorder p={20}>
          <Stack gap={30} ref={fieldRefs.audioFile}>
            <Title order={2}>Source</Title>
            {!recordings.length ? (
                <Flex justify="center" align="center">
                  <Loader color="blue" />
                </Flex>
              ) : (
                <Stack gap={10}>
                  {recordings.map(item => (
                    <Card
                      className={`${css.cardHover} ${selectedRecording?.id === item.id && css.cardSelected} ${appState !== APP_STATES.INIT && css.disabled}`}
                      key={item.id}
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      onClick={() => setSelectedRecording(item)}
                    >
                      <Text c="dimmed">{selectedRecording?.id === item.id ? '✅' : '🎬'} {item.date}{selectedRecording?.id === item.id ? ' (selected)' : ''}</Text>
                    </Card>
                  ))}
                </Stack>
              )}
          </Stack>
        </Paper>        

        <Paper shadow="md" withBorder p={20}>
          <Stack gap={30}>
            <Title order={2}>Output</Title>
            <Stack gap={20}>
              <Select
                disabled={appState !== APP_STATES.INIT}
                label="Select a Telegram group"
                placeholder="Pick one"
                data={TELEGRAM_GROUPS}
                value={group}
                onChange={handleGroupClick}
              />
            </Stack>
          </Stack>
        </Paper>

        <Flex>
          {appState === APP_STATES.INIT && (
            <Button type="submit" fullWidth disabled={!zoomToken}>Submit</Button>
          )}
          {appState === APP_STATES.STARTED && (
            <Flex justify="center" align="center">
              <Loader />
            </Flex>
          )}
          {appState === APP_STATES.COMPLETED && (
            <Button fullWidth color="gray" onClick={() => setAppState(APP_STATES.INIT)}>
              {appErrorState ? '❌ There was an error. Try again?' : '✅ Completed! Start a new submission?'}
            </Button>
          )}
        </Flex>
      </Stack>
    </form>
  );
}
