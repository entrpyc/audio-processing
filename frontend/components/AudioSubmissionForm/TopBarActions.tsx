import { useAudioSubmission } from "@/hooks/useAudioSubmission";
import { SUBMISSION_STATES } from "@/utils/config";
import { Button, Divider, Flex, Group } from "@mantine/core";

export default function TopBarActions() {
  const {
    activeStep,
    handlePrevStep,
    submissionState,
    handleNextStep,
  } = useAudioSubmission();

  return (
    <Flex direction="column">
      <Group justify="space-between">
        {activeStep > 0 ? (
          <Button variant="light" onClick={handlePrevStep} disabled={activeStep === 0 || submissionState !== SUBMISSION_STATES.INIT}>
            Back
          </Button>
        ) : (
          <div />
        )}
        
        {activeStep < 4 ? (
          <Button onClick={handleNextStep}>
            Next
          </Button>
        ) : (
          <div />
        )}
      </Group>

      <Divider my="md" />
    </Flex>
  );
}