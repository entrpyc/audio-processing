'use client';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import {
  Button,
  Card,
  Divider,
  FileInput,
  Flex,
  Loader,
  Paper,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { capitalize, downloadFile, formatDate, formatTitle } from '../utils/helpers';
import { ZoomRecording } from '../types/types';
import css from '../style/styles.module.css';
import { APP_STATES, BITRATE_OPTIONS, FREQUENCY_OPTIONS, TELEGRAM_GROUPS, TELEGRAM_SHEAF_YARD_GROUP_ID } from '../utils/config';
import { handleFileUpload, handleZoomRecordingUpload } from '../utils/requests';
import { useZoomData } from '../hooks/useZoomData';

export default function AdvancedForm() {
  const { zoomToken, recordings } = useZoomData();
  
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('zoom-cloud');
  const [selectedRecording, setSelectedRecording] = useState<ZoomRecording>();
  const [output, setOutput] = useState('telegram');
  const [group, setGroup] = useState<string>(TELEGRAM_SHEAF_YARD_GROUP_ID);
  const [filters, setFilters] = useState('default');
  const [volumeBoost, setVolumeBoost] = useState(1.5);
  const [bitrate, setBitrate] = useState(37.5);
  const [frequency, setFrequency] = useState(100);
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
      audioFile: (value) => (source === 'upload' && !value ? 'File is required' : null),
      title: (value) => (value ? null : 'Title is required'),
      date: (value) => (source === 'upload' && !value ? 'Date is required' : null),
    },
  });

  const selectedDate = source === 'zoom-cloud' ? `${selectedRecording?.dateRaw}` : form.getValues().date;
  const bitrateSubmitValue = BITRATE_OPTIONS.find(v => v.value === bitrate)?.formValue;
  const frequencySubmitValue = FREQUENCY_OPTIONS.find(v => v.value === frequency)?.label;

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
      let res;

      if(source === 'upload') res = await handleFileUpload({
        audioFile: form.values.audioFile as File,
        title: form.values.title,
        date: selectedDate,
        sendToTelegram: output === 'download' ? false : true,
        groupId: group,
        normalization: volumeBoost.toString(),
        bitrate: bitrateSubmitValue?.toString(),
        frequency: frequencySubmitValue?.toString(),
        filters,
      });
      else res = await handleZoomRecordingUpload({
        title: form.values.title,
        date: selectedDate,
        downloadUrl: selectedRecording?.downloadUrl,
        zoomToken,
        sendToTelegram: output === 'download' ? false : true,
        groupId: group,
        normalization: volumeBoost.toString(),
        bitrate: bitrateSubmitValue?.toString(),
        frequency: frequencySubmitValue?.toString(),
        applyFilters: filters === 'no-filters' ? false : true,
      });

      if(output === 'download') {
        setStatus(`📥 Converted successfully. Downloading....`);
        await downloadFile(res, formatTitle(selectedDate, form.values.title));
        setStatus(`✅ Downloaded successfully!`);

        return;
      }

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
          <Stack gap={30} ref={fieldRefs.audioFile}>
            <Title order={2}>Source</Title>
            <SegmentedControl
              disabled={appState !== APP_STATES.INIT}
              fullWidth
              size="md"
              value={source}
              onChange={setSource}
              data={[
                { label: '☁︎ Zoom Cloud', value: 'zoom-cloud' },
                { label: '📁 Upload', value: 'upload' },
              ]}
            />
            {source === 'zoom-cloud' ? (
              !recordings.length ? (
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
              )
            ) : (
              <FileInput
                disabled={appState !== APP_STATES.INIT}
                label="Audio File"
                placeholder="Select a file"
                withAsterisk
                accept="audio/*,video/*"
                {...form.getInputProps('audioFile')}
              />
            )}
          </Stack>
        </Paper>

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
              {source === 'upload' && (
                <DateInput
                  disabled={appState !== APP_STATES.INIT}
                  label="Date"
                  ref={fieldRefs.date}
                  placeholder="When was this meeting recorded?"
                  withAsterisk
                  valueFormat="YYYY-MM-DD"
                  {...form.getInputProps('date')}
                />
              )}
            </Stack>
          </Stack>
        </Paper>

        <Paper shadow="md" withBorder p={20}>
          <Stack gap={30}>
            <Title order={2}>Output</Title>
            <Stack gap={20}>
              <SegmentedControl
                disabled={appState !== APP_STATES.INIT}
                value={output}
                onChange={setOutput}
                data={[
                  { label: 'Send to Telegram', value: 'telegram' },
                  { label: 'Download', value: 'download' },
                ]}
              /> 
              {output === 'telegram' ? (
                <Select
                  disabled={appState !== APP_STATES.INIT}
                  label="Select a Telegram group"
                  placeholder="Pick one"
                  data={TELEGRAM_GROUPS}
                  value={group}
                  onChange={handleGroupClick}
                />
              ) : (
                <Text>The recording will be downloaded after its processed.</Text>
              )}
            </Stack>
          </Stack>
        </Paper>

        <Paper shadow="md" withBorder p={20} pb={40}>
          <Stack gap={30}>
            <Title order={2}>Audio Filters</Title>
            <Stack gap={30}>
              <SegmentedControl
                disabled={appState !== APP_STATES.INIT}
                value={filters}
                onChange={setFilters}
                data={[
                  { label: 'Use default settings', value: 'default' },
                  { label: 'No filters', value: 'no-filters' },
                  { label: 'Use custom settings', value: 'custom' },
                ]}
              />
              {filters === 'default' && (
                <Text>The default audio filters will be applied.</Text>
              )}
              {filters === 'no-filters' && (
                <Text>No filters will be applied.</Text>
              )}
              {filters === 'custom' && (
                <Stack gap={40}>
                  <Stack>
                    <Text size="sm">Volume boost</Text>
                    <Slider
                      disabled={appState !== APP_STATES.INIT}
                      size="lg"
                      value={volumeBoost}
                      onChange={setVolumeBoost}
                      defaultValue={1.5}
                      min={1.0}
                      max={3.0}
                      step={0.1}
                      marks={[
                        { value: 0, label: '1.0' },
                        { value: 100, label: '3.0' },
                      ]}
                    />
                  </Stack>
                  <Stack>
                    <Text size="sm">Bitrate</Text>
                    <Slider
                      disabled={appState !== APP_STATES.INIT}
                      size="lg"
                      value={bitrate}
                      onChange={setBitrate}
                      defaultValue={37.5}
                      label={(val) => BITRATE_OPTIONS.find((opt) => opt.value === val)!.label}
                      step={12.5}
                      marks={BITRATE_OPTIONS}
                    />
                  </Stack>
                  <Stack>
                    <Text size="sm">Frequency</Text>
                    <Slider
                      disabled={appState !== APP_STATES.INIT}
                      size="lg"
                      value={frequency}
                      onChange={setFrequency}
                      defaultValue={100}
                      label={(val) => FREQUENCY_OPTIONS.find((opt) => opt.value === val)!.label}
                      step={25}
                      marks={FREQUENCY_OPTIONS}
                    />
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Paper>

        <Paper shadow="md" withBorder p={20}>
          <Title order={2} mb="sm">Confirm and Upload</Title>
          <Text><strong>Title:</strong> {capitalize(form.getValues().title || '-')}</Text>
          <Text><strong>Date:</strong> {source === 'zoom-cloud' && !selectedRecording?.date ? '-' : selectedDate ? formatDate(selectedDate) : '-'}</Text>
          <Text><strong>Source:</strong> {source === 'zoom-cloud' ? `Cloud recording from ${selectedRecording?.date ?? '-'}` : `Uploaded file "${form.getValues().audioFile?.name || '-'}"`}</Text>
          <Text><strong>Output:</strong> {output === 'download' ? 'Download to this device' : TELEGRAM_GROUPS.find(g => g.value === group)?.label}</Text>
          <Text><strong>Filters:</strong> {(filters === 'default' && 'Default filters') || (filters === 'no-filters' && 'No filters') || `Volume boost - ${volumeBoost}, Bitrate - ${BITRATE_OPTIONS.find(v => v.value === bitrate)?.label}, Frequency - ${FREQUENCY_OPTIONS.find(v => v.value === frequency)?.label}`}</Text>
          <Divider my={20} />
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
        </Paper>
      </Stack>
    </form>
  );
}
