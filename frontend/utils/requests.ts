type HandleZoomRecordingUploadParams = {
  title: string;
  date: string;
  downloadUrl: string;
  groupId: string;
  zoomToken: string;
  sendToTelegram: boolean;
  applyFilters?: boolean;
  normalization?: string;
  frequency?: string;
  bitrate?: string;
}

type HandleFileUploadParams = {
  audioFile: File;
  title: string;
  date: string;
  sendToTelegram: boolean;
  groupId: string;
  filters: string;
  frequency?: string;
  bitrate?: string;
  normalization: string;
}

export const handleZoomRecordingUpload = async (params: HandleZoomRecordingUploadParams) => {
  const res = await fetch(process.env.NEXT_PUBLIC_PROCESS_ZOOM_RECORDING as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
  });

  return res;
}

export const handleFileUpload = async ({
  audioFile,
  title,
  date,
  sendToTelegram,
  groupId,
  normalization,
  bitrate,
  frequency,
  filters,
}: HandleFileUploadParams) => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  formData.append('title', title);
  formData.append('date', date);
  formData.append('groupId', groupId);
  if(sendToTelegram !== undefined) formData.append('sendToTelegram', sendToTelegram.toString());
  if(filters === 'custom' && normalization) formData.append('normalization', normalization.toString());
  if(filters === 'custom' && bitrate) formData.append('bitrate', bitrate);
  if(filters === 'custom' && frequency) formData.append('frequency', frequency);
  if(filters === 'no-filters') formData.append('applyFilters', 'false');

  const res = await fetch(process.env.NEXT_PUBLIC_PROCESS_AUDIO_ENDPOINT as string, {
    method: 'POST',
    body: formData,
  });

  return res;
}