'use client'

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { ZoomRecording } from "../types/types";

type AudioSubmissionContextValue = {
  selectedRecording: ZoomRecording | undefined;
  setSelectedRecording: Dispatch<SetStateAction<ZoomRecording | undefined>>;
}

const defaultValues = {
  selectedRecording: undefined,
  setSelectedRecording: () => {},
}

export const AudioSubmissionContext = createContext<AudioSubmissionContextValue>(defaultValues);

export function AudioSubmissionProvider({ children }: { children: React.ReactNode }) {
  const [selectedRecording, setSelectedRecording] = useState<ZoomRecording | undefined>(defaultValues.selectedRecording);

  return (
    <AudioSubmissionContext.Provider value={{
      selectedRecording,
      setSelectedRecording,
    }}>
      {children}
    </AudioSubmissionContext.Provider>
  );
}