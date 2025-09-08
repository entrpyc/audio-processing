'use client'

import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { ZoomRecording } from "../types/types";

type ZoomDataContextValue = {
  recordings: ZoomRecording[];
  setRecordings: Dispatch<SetStateAction<ZoomRecording[]>>;
  zoomToken: string;
  setZoomToken: Dispatch<SetStateAction<string>>;
}

const defaultValues = {
  recordings: [],
  setRecordings: () => {},
  zoomToken: '',
  setZoomToken: () => {},
}

export const ZoomDataContext = createContext<ZoomDataContextValue>(defaultValues);

export function ZoomDataProvider({ children }: { children: React.ReactNode }) {
  const [recordings, setRecordings] = useState<ZoomRecording[]>(defaultValues.recordings);
  const [zoomToken, setZoomToken] = useState<string>(defaultValues.zoomToken);

  useEffect(() => {
    console.log(recordings)
  }, [recordings])

  return (
    <ZoomDataContext.Provider value={{
      recordings,
      setRecordings,
      zoomToken,
      setZoomToken
    }}>
      {children}
    </ZoomDataContext.Provider>
  );
}