import { useAudioSubmission } from "@/hooks/useAudioSubmission";
import { useZoomData } from "@/hooks/useZoomData";
import { BITRATE_OPTIONS, FREQUENCY_OPTIONS, SUBMISSION_STATES, TELEGRAM_GROUPS } from "@/utils/config";
import { Button, Divider, Flex, Loader, Stack, Text, Title } from "@mantine/core";

import { capitalize, formatDate } from "@/utils/helpers";

export default function StepSubmit() {
  const { zoomToken } = useZoomData();
  const {
    selectedGroup,
    submissionState,
    source,
    selectedRecording,
    output,
    filters,
    form,
    volumeBoost,
    selectedDate,
    frequency,
    setSubmissionState,
    submissionErrorState,
    bitrate,
    setActiveStep,
  } = useAudioSubmission(); 
  
  return (
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
        {submissionState === SUBMISSION_STATES.INIT && (
          <Button type="submit" fullWidth>Submit</Button>
        )}

        {submissionState === SUBMISSION_STATES.STARTED && (
          <Loader />
        )}

        {submissionState === SUBMISSION_STATES.COMPLETED && (
          <Button fullWidth color="gray" onClick={() => {
            setSubmissionState(SUBMISSION_STATES.INIT);
            setActiveStep(0);
          }}>
            {submissionErrorState
              ? '❌ There was an error. Try again?'
              : '✅ Completed! Start a new submission?'}
          </Button>
        )}
      </Flex>
    </Stack>
  );
}