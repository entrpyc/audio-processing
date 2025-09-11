import { useAudioSubmission } from "@/hooks/useAudioSubmission";
import { OUTPUT_TYPES, SUBMISSION_STATES, TELEGRAM_GROUPS } from "@/utils/config";
import { SegmentedControl, Select, Stack, Text, TextInput } from "@mantine/core";

import audioSubmissionCss from '@/styles/AudioSubmission.module.css';

export default function StepOutput() {
  const {
    submissionState,
    form,
    output,
    setOutput,
    selectedGroup,
    handleSelectGroup,
  } = useAudioSubmission(); 
  
  return (
    <Stack gap={20}>
      <SegmentedControl
        disabled={submissionState !== SUBMISSION_STATES.INIT}
        value={output}
        onChange={(v) => setOutput(v as OUTPUT_TYPES)}
        data={[
          { label: 'Send to Telegram', value: 'telegram' },
          { label: 'Download', value: 'download' },
        ]}
        classNames={{ root: audioSubmissionCss.segmentedRoot }}
      />
      {output === 'telegram' ? (
        <Select
          disabled={submissionState !== SUBMISSION_STATES.INIT}
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
}