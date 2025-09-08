import { createContext, Dispatch, SetStateAction, useState } from "react";
import { ZoomRecording } from "../types/types";

type RecordingsContextValue = {
  recordings: ZoomRecording[]
  setRecordings: Dispatch<SetStateAction<ZoomRecording[]>>
}

const defaultRecordingContext = {
  recordings: [],
  setRecordings: () => {}
}

export const RecordingsContext = createContext<RecordingsContextValue>(defaultRecordingContext);

export function RecordingsProvider({ children }: { children: React.ReactNode }) {
  const [recordings, setRecordings] = useState<ZoomRecording[]>([]);

  return (
    <RecordingsContext.Provider value={{
      recordings,
      setRecordings,
    }}>
      {children}
    </RecordingsContext.Provider>
  );
}