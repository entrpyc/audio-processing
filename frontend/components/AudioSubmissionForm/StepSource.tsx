import { useAudioSubmission } from "@/hooks/useAudioSubmission";
import { useZoomData } from "@/hooks/useZoomData";
import { SOURCE_TYPES, SUBMISSION_STATES } from "@/utils/config";
import { Card, FileInput, Flex, Loader, SegmentedControl, Stack, Text } from "@mantine/core";

import globalCss from '@/styles/global.module.css';
import audioSubmissionCss from '@/styles/AudioSubmission.module.css';

export default function StepSource() {
  const { recordings } = useZoomData();
  const {
    fieldRefs,
    submissionState,
    source,
    selectedRecording,
    setSource,
    setSelectedRecording,
    form,
  } = useAudioSubmission(); 
  
  return (
    <Stack gap={30} ref={fieldRefs.audioFileRef}>
      <SegmentedControl
        disabled={submissionState !== SUBMISSION_STATES.INIT}
        fullWidth
        value={source}
        onChange={(val) => setSource(val as SOURCE_TYPES)}
        data={[
          { label: '☁︎ Zoom Cloud', value: 'zoom-cloud' },
          { label: '📁 Upload', value: 'upload' },
        ]}
        classNames={{ root: audioSubmissionCss.segmentedRoot }}
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
                className={`${globalCss.cardHover} ${
                  selectedRecording?.id === item.id && globalCss.cardSelected
                } ${submissionState !== SUBMISSION_STATES.INIT && globalCss.disabled}`}
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
          disabled={submissionState !== SUBMISSION_STATES.INIT}
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
}