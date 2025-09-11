import { useAudioSubmission } from "@/hooks/useAudioSubmission";
import { BITRATE_OPTIONS, FREQUENCY_OPTIONS, SUBMISSION_STATES } from "@/utils/config";
import { SegmentedControl, Slider, Stack, Text } from "@mantine/core";

import audioSubmissionCss from '@/styles/AudioSubmission.module.css';

export default function StepFilters() {
  const {
    filters,
    submissionState,
    volumeBoost,
    bitrate,
    setBitrate,
    frequency,
    setFrequency,
    setVolumeBoost,
    setFilters,
  } = useAudioSubmission(); 
  
  return (
    <Stack gap={24}>
      <SegmentedControl
        disabled={submissionState !== SUBMISSION_STATES.INIT}
        value={filters}
        onChange={(v) => setFilters(v as typeof filters)}
        data={[
          { label: 'Use default settings', value: 'default' },
          { label: 'No filters', value: 'no-filters' },
          { label: 'Use custom settings', value: 'custom' },
        ]}
        classNames={{ root: audioSubmissionCss.segmentedRoot }}
      />

      {filters === 'default' && <Text>The default audio filters will be applied.</Text>}

      {filters === 'no-filters' && <Text>No filters will be applied.</Text>}

      {filters === 'custom' && (
        <Stack gap={28}>
          <Stack>
            <Text size="sm">Volume boost</Text>
            <Slider
              disabled={submissionState !== SUBMISSION_STATES.INIT}
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
              disabled={submissionState !== SUBMISSION_STATES.INIT}
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
              disabled={submissionState !== SUBMISSION_STATES.INIT}
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
}