import { BITRATE_OPTIONS, FREQUENCY_OPTIONS } from "@/utils/config";
import { useAudioSubmissionContext } from "../contexts/AudioSubmissionContext";

export const useGetAudioSubmission = () => {
  const {
    selectedRecording,
    selectedGroup,
    status,
    source,
    output,
    filters,
    volumeBoost,
    bitrate,
    frequency,
    submissionState,
    submissionErrorState,
    activeStep,
    fieldRefs,
    form,
  } = useAudioSubmissionContext();

  const selectedDate = source === 'zoom-cloud' ? `${selectedRecording?.dateRaw ?? ''}` : form.getValues().date;

  const bitrateSubmitValue = BITRATE_OPTIONS.find((v) => v.value === bitrate)?.formValue;
  const frequencySubmitValue = FREQUENCY_OPTIONS.find((v) => v.value === frequency)?.label;

  return {
    selectedRecording,
    selectedGroup,
    status,
    source,
    output,
    filters,
    volumeBoost,
    bitrate,
    frequency,
    submissionState,
    submissionErrorState,
    activeStep,
    fieldRefs,
    form,
    selectedDate,
    bitrateSubmitValue,
    frequencySubmitValue,
  }
}