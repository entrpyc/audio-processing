import { useAudioSubmission } from "@/hooks/useAudioSubmission";
import { useTheme } from "@/hooks/useTheme";
import { Paper, Stepper } from "@mantine/core";
import { IconAdjustmentsAlt, IconCheck, IconCloudUpload, IconInfoCircle, IconSend } from "@tabler/icons-react";

import audioSubmissionCss from '@/styles/AudioSubmission.module.css';

export default function FormNavigation() {
  const {
    activeStep,
    setActiveStep,
  } = useAudioSubmission();
  const { isMobile } = useTheme();

  return (
    <Paper shadow="md" withBorder p={20}>
      <Stepper
        active={activeStep}
        onStepClick={(i) => i <= activeStep && setActiveStep(i)}
        size={isMobile ? 'xs' : 'sm'}
        classNames={{
          stepBody: audioSubmissionCss.stepBody,
          separator: audioSubmissionCss.separator
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
  );
}