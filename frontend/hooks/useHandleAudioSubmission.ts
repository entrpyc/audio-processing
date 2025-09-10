import { useAudioSubmissionContext } from "../contexts/AudioSubmissionContext";
import { TELEGRAM_GROUPS } from "../utils/config";
import { useGetAudioSubmission } from "./useGetAudioSubmission";

export const useHandleAudioSubmission = () => {
  const {
    setSelectedRecording,
    setSelectedGroup,
    setStatus,
    setSource,
    setOutput,
    setFilters,
    setVolumeBoost,
    setBitrate,
    setFrequency,
    setSubmissionState,
    setSubmissionErrorState,
    setActiveStep
  } = useAudioSubmissionContext();
  const {
    form,
    source,
    selectedRecording,
    output,
    selectedGroup,
    filters,
    volumeBoost,
    activeStep,
    fieldRefs
  } = useGetAudioSubmission();

  const handleSelectGroup = (groupId: string | null) => {
    const selectedGroup = TELEGRAM_GROUPS.find(g => g.id === groupId);
    if(selectedGroup) setSelectedGroup(selectedGroup);
  };

  const handleValidateStep = (step: number) => {
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

  const handleNextStep = () => {
    if (handleValidateStep(activeStep)) {
      setActiveStep((s) => Math.min(s + 1, 4));
    } else {
      const firstErrorKey = Object.keys(form.errors)[0] as keyof typeof fieldRefs | undefined;
      if (firstErrorKey && fieldRefs[firstErrorKey]) {
        fieldRefs[firstErrorKey]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fieldRefs[firstErrorKey]?.current?.focus();
      }
    }
  };

  const handlePrevStep = () => setActiveStep((s) => Math.max(s - 1, 0));

  return {
    setStatus,
    setSource,
    setOutput,
    setFilters,
    setVolumeBoost,
    setBitrate,
    setFrequency,
    setSubmissionState,
    setSubmissionErrorState,
    setActiveStep,
    setSelectedRecording,
    handleValidateStep,
    handleSelectGroup,
    handleNextStep,
    handlePrevStep,
  }
}