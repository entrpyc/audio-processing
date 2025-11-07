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

const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const currentMonthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const previousMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0);

export const currentMonthRange  = [formatDateRange(currentMonthStart), formatDateRange(currentMonthEnd)];
export const previousMonthRange = [formatDateRange(previousMonthStart), formatDateRange(previousMonthEnd)];
export const fullRange = [formatDateRange(previousMonthStart), formatDateRange(currentMonthEnd)];