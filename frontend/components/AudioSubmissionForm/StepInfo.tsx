import { useAudioSubmission } from "@/hooks/useAudioSubmission";
import { SUBMISSION_STATES } from "@/utils/config";
import { Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";


export default function StepInfo() {
  const {
    fieldRefs,
    submissionState,
    source,
    form,
  } = useAudioSubmission(); 
  
  return (
    <Stack gap={20}>
      <TextInput
        disabled={submissionState !== SUBMISSION_STATES.INIT}
        label="Title"
        ref={fieldRefs.titleRef}
        placeholder="What should be the title of this meeting?"
        withAsterisk
        key={form.key('title')}
        {...form.getInputProps('title')}
        error={form.errors.title}
      />
      {source === 'upload' && (
        <DateInput
          disabled={submissionState !== SUBMISSION_STATES.INIT}
          label="Date"
          ref={fieldRefs.dateRef}
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
}