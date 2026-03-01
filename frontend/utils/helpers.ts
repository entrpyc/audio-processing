import { cloudSearchDateLimit } from "./config";

export const formatDate = (inputDate: string) => {
  const date = new Date(inputDate);
  const day = date.getDate();
  const daySuffix =
    day === 1 || day === 21 || day === 31
      ? 'st'
      : day === 2 || day === 22
      ? 'nd'
      : day === 3 || day === 23
      ? 'rd'
      : 'th';
  const options = { month: 'long' };
  const month = date.toLocaleDateString('en-GB', options as any);
  const year = date.getFullYear();
  const formattedDate = `${day}${daySuffix} ${month}, ${year}`;

  return formattedDate;
}

export function formatTitle(inputDate: string, inputTitle: string) {  
  const formattedDate = formatDate(inputDate);

  const formattedName = capitalize(inputTitle);
  const title = `${formattedName} - ${formattedDate}`;
  const fileName = `${title}.mp3`;

  return fileName;
}

export const downloadFile = async (res: Response, name: string) =>{
  const blob = await res.blob();

  // Trigger download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export const capitalize = (value: string) => {
  return value.toLowerCase().charAt(0).toUpperCase() + value.slice(1)
}

const formatDateRange = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const now = new Date();

const recordingsRangeStart = new Date(now);
const recordingsRangeEnd = new Date(now);
recordingsRangeStart.setDate(now.getDate() - cloudSearchDateLimit);
recordingsRangeEnd.setDate(now.getDate() + 1);

export const recordingsDateRange = [formatDateRange(recordingsRangeStart), formatDateRange(recordingsRangeEnd)];
