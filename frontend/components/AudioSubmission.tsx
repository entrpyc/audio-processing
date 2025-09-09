'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Divider,
  FileInput,
  Flex,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { capitalize, downloadFile, formatDate, formatTitle } from '@/utils/helpers';
import { ZoomRecording } from '@/types/types';
import css from '@/styles/global.module.css';
import { APP_STATES, BITRATE_OPTIONS, FREQUENCY_OPTIONS, TELEGRAM_GROUPS } from '@/utils/config';
import { handleFileUpload, handleZoomRecordingUpload } from '@/utils/requests';
import { useZoomData } from '@/hooks/useZoomData';
import { useAudioSubmission } from '@/hooks/useAudioSubmission';

import classes from '@/styles/AudioSubmission.module.css';
import { IconAdjustmentsAlt, IconCheck, IconCloudUpload, IconInfoCircle, IconSend } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export default function AdvancedForm() {
  const { zoomToken, recordings } = useZoomData();
  const { selectedGroup, handleSelectGroup } = useAudioSubmission();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [status, setStatus] = useState('');
  const [source, setSource] = useState<'zoom-cloud' | 'upload'>('zoom-cloud');
  const [selectedRecording, setSelectedRecording] = useState<ZoomRecording | undefined>();
  const [output, setOutput] = useState<'telegram' | 'download'>('telegram');
  const [filters, setFilters] = useState<'default' | 'no-filters' | 'custom'>('default');
  const [volumeBoost, setVolumeBoost] = useState(1.5);
  const [bitrate, setBitrate] = useState(37.5);
  const [frequency, setFrequency] = useState(100);
  const [appState, setAppState] = useState(APP_STATES.INIT);
  const [appErrorState, setAppErrorState] = useState<boolean>(false);

  const [active, setActive] = useState(0);

  const fieldRefs = {
    audioFile: useRef<HTMLInputElement>(null),
    title: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
  };

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      audioFile: null as File | null,
      title: '',
      date: '',
    },
  });

  const selectedDate =
    source === 'zoom-cloud' ? `${selectedRecording?.dateRaw ?? ''}` : form.getValues().date;

  const bitrateSubmitValue = BITRATE_OPTIONS.find((v) => v.value === bitrate)?.formValue;
  const frequencySubmitValue = FREQUENCY_OPTIONS.find((v) => v.value === frequency)?.label;

  const validateStep = (step: number) => {
    const values = form.getValues();
    const errors: Record<string, string | undefined> = {};

    if (step === 0) {
      if (source === 'upload' && !values.audioFile) errors.audioFile = 'File is required';
      if (source === 'zoom-cloud' && !selectedRecording)
        errors.audioFile = 'Please select a cloud recording';
    }

    if (step === 1) {
      if (!values.title?.trim()) errors.title = 'Title is required';
      if (source === 'upload' && !values.date) errors.date = 'Date is required';
    }

    if (step === 2) {
      if (output === 'telegram' && !selectedGroup?.id) errors.output = 'Pick a Telegram group';
    }

    if (step === 3) {
      if (filters === 'custom') {
        if (volumeBoost < 1 || volumeBoost > 3) errors.volumeBoost = 'Volume must be 1.0–3.0';
      }
    }

    form.setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const next = () => {
    if (validateStep(active)) {
      setActive((s) => Math.min(s + 1, 4));
    } else {
      const firstErrorKey = Object.keys(form.errors)[0] as keyof typeof fieldRefs | undefined;
      if (firstErrorKey && fieldRefs[firstErrorKey]) {
        fieldRefs[firstErrorKey]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fieldRefs[firstErrorKey]?.current?.focus();
      }
    }
  };

  const prev = () => setActive((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    for (let s = 0; s <= 3; s++) {
      if (!validateStep(s)) {
        setActive(s);
        return;
      }
    }
    if (!zoomToken) {
      setStatus('❌ Upload failed: Missing Zoom token');
      setAppErrorState(true);
      setAppState(APP_STATES.COMPLETED);
      return;
    }
    if (source === 'zoom-cloud' && !selectedRecording?.downloadUrl) {
      setStatus('❌ Upload failed: No download URL for the selected recording');
      setAppErrorState(true);
      setAppState(APP_STATES.COMPLETED);
      return;
    }

    setAppState(APP_STATES.STARTED);
    setStatus('🚀 Uploading');

    try {
      let res: Response | Blob | undefined;

      if (source === 'upload') {
        res = await handleFileUpload({
          audioFile: form.getValues().audioFile as File,
          title: form.getValues().title,
          date: selectedDate,
          sendToTelegram: output !== 'download',
          groupId: selectedGroup.id,
          normalization: volumeBoost.toString(),
          bitrate: bitrateSubmitValue?.toString(),
          frequency: frequencySubmitValue?.toString(),
          filters,
        });
      } else {
        res = await handleZoomRecordingUpload({
          title: form.getValues().title,
          date: selectedDate,
          downloadUrl: selectedRecording?.downloadUrl!,
          zoomToken,
          sendToTelegram: output !== 'download',
          groupId: selectedGroup.id,
          normalization: volumeBoost.toString(),
          bitrate: bitrateSubmitValue?.toString(),
          frequency: frequencySubmitValue?.toString(),
          applyFilters: filters !== 'no-filters',
        });
      }

      if (output === 'download') {
        setStatus(`📥 Converted successfully. Downloading....`);
        await downloadFile(res, formatTitle(selectedDate, form.getValues().title));
        setStatus(`✅ Downloaded successfully!`);
        setAppState(APP_STATES.COMPLETED);
        return;
      }

      const data = await (res as Response).json();

      if ((data as any).error) {
        setStatus(`❌ Upload failed: ${data.error}`);
        setAppErrorState(true);
        setAppState(APP_STATES.COMPLETED);
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

  useEffect(() => {
    setSelectedRecording(recordings?.[0]);
  }, [recordings]);

  useEffect(() => {
    if (!status) return;
    notifications.show({ title: 'Status', message: status });
  }, [status]);

  const StepSource = (
    <Stack gap={30} ref={fieldRefs.audioFile}>
      <SegmentedControl
        disabled={appState !== APP_STATES.INIT}
        fullWidth
        value={source}
        onChange={(val) => setSource(val as 'zoom-cloud' | 'upload')}
        data={[
          { label: '☁︎ Zoom Cloud', value: 'zoom-cloud' },
          { label: '📁 Upload', value: 'upload' },
        ]}
        classNames={{ root: classes.segmentedRoot }}
      />

      {source === 'zoom-cloud' ? (
        !recordings.length ? (
          <Flex justify="center" align="center">
            <Loader />
          </Flex>
        ) : (
          <Stack gap={10}>
            {recordings.map((item) => (
              <Card
                className={`${css.cardHover} ${
                  selectedRecording?.id === item.id && css.cardSelected
                } ${appState !== APP_STATES.INIT && css.disabled}`}
                key={item.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                onClick={() => setSelectedRecording(item)}
              >
                <Text c="dimmed">
                  {selectedRecording?.id === item.id ? '✅' : '🎬'} {item.date}
                  {selectedRecording?.id === item.id ? ' (selected)' : ''}
                </Text>
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
          key={form.key('audioFile')}
          {...form.getInputProps('audioFile')}
          error={form.errors.audioFile}
        />
      )}
    </Stack>
  );

  const StepInfo = (
    <Stack gap={20}>
      <TextInput
        disabled={appState !== APP_STATES.INIT}
        label="Title"
        ref={fieldRefs.title}
        placeholder="What should be the title of this meeting?"
        withAsterisk
        key={form.key('title')}
        {...form.getInputProps('title')}
        error={form.errors.title}
      />
      {source === 'upload' && (
        <DateInput
          disabled={appState !== APP_STATES.INIT}
          label="Date"
          ref={fieldRefs.date}
          placeholder="When was this meeting recorded?"
          withAsterisk
          valueFormat="YYYY-MM-DD"
          key={form.key('date')}
          {...form.getInputProps('date')}
          error={form.errors.date}
        />
      )}
    </Stack>
  );

  const StepOutput = (
    <Stack gap={20}>
      <SegmentedControl
        disabled={appState !== APP_STATES.INIT}
        value={output}
        onChange={(v) => setOutput(v as 'telegram' | 'download')}
        data={[
          { label: 'Send to Telegram', value: 'telegram' },
          { label: 'Download', value: 'download' },
        ]}
        classNames={{ root: classes.segmentedRoot }}
      />
      {output === 'telegram' ? (
        <Select
          disabled={appState !== APP_STATES.INIT}
          label="Select a Telegram group"
          placeholder="Pick one"
          data={TELEGRAM_GROUPS.map((g) => ({ ...g, value: g.id }))}
          value={selectedGroup.id}
          onChange={handleSelectGroup}
          error={form.errors.output as string | undefined}
        />
      ) : (
        <Text>The recording will be downloaded after it’s processed.</Text>
      )}
    </Stack>
  );

  const StepFilters = (
    <Stack gap={24}>
      <SegmentedControl
        disabled={appState !== APP_STATES.INIT}
        value={filters}
        onChange={(v) => setFilters(v as typeof filters)}
        data={[
          { label: 'Use default settings', value: 'default' },
          { label: 'No filters', value: 'no-filters' },
          { label: 'Use custom settings', value: 'custom' },
        ]}
        classNames={{ root: classes.segmentedRoot }}
      />

      {filters === 'default' && <Text>The default audio filters will be applied.</Text>}

      {filters === 'no-filters' && <Text>No filters will be applied.</Text>}

      {filters === 'custom' && (
        <Stack gap={28}>
          <Stack>
            <Text size="sm">Volume boost</Text>
            <Slider
              disabled={appState !== APP_STATES.INIT}
              size="lg"
              value={volumeBoost}
              onChange={setVolumeBoost}
              min={1.0}
              max={3.0}
              step={0.1}
              marks={[
                { value: 1, label: '1.0' },
                { value: 3, label: '3.0' },
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
              label={(val) => FREQUENCY_OPTIONS.find((opt) => opt.value === val)!.label}
              step={25}
              marks={FREQUENCY_OPTIONS}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );

  const StepSubmit = (
    <Stack gap={16}>
      <Title order={3}>Confirm and Upload</Title>

      <Text>
        <strong>Title:</strong> {capitalize(form.getValues().title || '-')}
      </Text>
      <Text>
        <strong>Date:</strong>{' '}
        {source === 'zoom-cloud' && !selectedRecording?.date
          ? '-'
          : selectedDate
          ? formatDate(selectedDate)
          : '-'}
      </Text>
      <Text>
        <strong>Source:</strong>{' '}
        {source === 'zoom-cloud'
          ? `Cloud recording from ${selectedRecording?.date ?? '-'}`
          : `Uploaded file "${form.getValues().audioFile?.name || '-'}"`}
      </Text>
      <Text>
        <strong>Output:</strong>{' '}
        {output === 'download'
          ? 'Download to this device'
          : TELEGRAM_GROUPS.find((g) => g.id === selectedGroup.id)?.label}
      </Text>
      <Text>
        <strong>Filters:</strong>{' '}
        {(filters === 'default' && 'Default filters') ||
          (filters === 'no-filters' && 'No filters') ||
          `Volume boost - ${volumeBoost}, Bitrate - ${
            BITRATE_OPTIONS.find((v) => v.value === bitrate)?.label
          }, Frequency - ${FREQUENCY_OPTIONS.find((v) => v.value === frequency)?.label}`}
      </Text>

      <Divider my={10} />

      <Flex justify="center" align="center">
        {appState === APP_STATES.INIT && (
          <Button type="submit" fullWidth disabled={!zoomToken}>Submit</Button>
        )}

        {appState === APP_STATES.STARTED && (
          <Loader />
        )}

        {appState === APP_STATES.COMPLETED && (
          <Button fullWidth color="gray" onClick={() => {
            setAppState(APP_STATES.INIT);
            setActive(0);
          }}>
            {appErrorState
              ? '❌ There was an error. Try again?'
              : '✅ Completed! Start a new submission?'}
          </Button>
        )}
      </Flex>
    </Stack>
  );

  const renderStepContent = () => {
    switch (active) {
      case 0:
        return StepSource;
      case 1:
        return StepInfo;
      case 2:
        return StepOutput;
      case 3:
        return StepFilters;
      case 4:
        return StepSubmit;
      default:
        return null;
    }
  };

  const renderTopActions = () => {
    if(appState === APP_STATES.COMPLETED) return null;

    return (
      <Flex direction="column">
        <Group justify="space-between">
          {active > 0 ? (
            <Button variant="light" onClick={prev} disabled={active === 0 || appState !== APP_STATES.INIT}>
              Back
            </Button>
          ) : (
            <div />
          )}
          
          {active < 4 ? (
            <Button onClick={next}>
              Next
            </Button>
          ) : (
            <div />
          )}
        </Group>

        <Divider my="md" />
      </Flex>
    );
  };

  return (
    <Stack gap={30}>
      <Paper shadow="md" withBorder p={20}>
        <Stepper
          active={active}
          onStepClick={(i) => i <= active && setActive(i)}
          size={isMobile ? 'xs' : 'sm'}
          classNames={{
            stepBody: classes.stepBody,
            separator: classes.separator
          }}
        >
          <Stepper.Step
            icon={<IconCloudUpload size={20} />}
            label="Source"
            description="Cloud or upload"
          />
          <Stepper.Step
            icon={<IconInfoCircle size={20} />}
            label="Info"
            description="Title & date"
          />
          <Stepper.Step
            icon={<IconSend size={20} />}
            label="Output"
            description="Destination"
          />
          <Stepper.Step
            icon={<IconAdjustmentsAlt size={20} />}
            label="Filters"
            description="Audio settings"
          />
          <Stepper.Step
            icon={<IconCheck size={20} />}
            label="Submit"
            description="Review & send"
          />
        </Stepper>
      </Paper>


      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (active === 4) handleSubmit();
          else next();
        }}
      >
        <Paper shadow="md" withBorder p={20}>
          {/* Top action bar */}
          {renderTopActions()}

          {/* Step content */}
          {renderStepContent()}
        </Paper>
      </form>
    </Stack>
  );
}
