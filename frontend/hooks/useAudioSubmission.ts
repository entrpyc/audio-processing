import { useGetAudioSubmission } from "./useGetAudioSubmission"
import { useHandleAudioSubmission } from "./useHandleAudioSubmission"

export const useAudioSubmission = () => {
  const audioSubmissionState = useGetAudioSubmission();
  const audioSubmissionHandle = useHandleAudioSubmission();
  
  return {
    ...audioSubmissionState,
    ...audioSubmissionHandle,
  }
}