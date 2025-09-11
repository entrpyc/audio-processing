import { FormEvent } from "react";
import { useAudioSubmissionContext } from "../contexts/AudioSubmissionContext";
import { SUBMISSION_STATES, TELEGRAM_GROUPS } from "../utils/config";
import { useGetAudioSubmission } from "./useGetAudioSubmission";
import { useZoomData } from "./useZoomData";
import { handleFileUpload, handleZoomRecordingUpload } from "@/utils/requests";
import { downloadFile, formatTitle } from "@/utils/helpers";

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
    fieldRefs,
    selectedDate,
    frequencySubmitValue,
    bitrateSubmitValue,
  } = useGetAudioSubmission();
  const { zoomToken } = useZoomData();

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

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeStep < 4) return handleNextStep();
    
    for (let s = 0; s <= 3; s++) {
      if (!handleValidateStep(s)) {
        setActiveStep(s);
        return;
      }
    }
    if (!zoomToken) {
      setStatus('❌ Upload failed: Missing Zoom token');
      setSubmissionErrorState(true);
      setSubmissionState(SUBMISSION_STATES.COMPLETED);
      return;
    }
    if (source === 'zoom-cloud' && !selectedRecording?.downloadUrl) {
      setStatus('❌ Upload failed: No download URL for the selected recording');
      setSubmissionErrorState(true);
      setSubmissionState(SUBMISSION_STATES.COMPLETED);
      return;
    }

    setSubmissionState(SUBMISSION_STATES.STARTED);
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
        setSubmissionState(SUBMISSION_STATES.COMPLETED);
        return;
      }

      const data = await (res as Response).json();

      if ((data as any).error) {
        setStatus(`❌ Upload failed: ${data.error}`);
        setSubmissionErrorState(true);
        setSubmissionState(SUBMISSION_STATES.COMPLETED);
        return;
      }

      setStatus(`✅ ${data.status}`);
    } catch (err: any) {
      setStatus(`❌ Upload failed: ${err.message}`);
      setSubmissionErrorState(true);
    } finally {
      setSubmissionState(SUBMISSION_STATES.COMPLETED);
    }
  }

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
    handleFormSubmit,
  }
}