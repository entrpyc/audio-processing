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

  const formattedName = inputTitle.toLowerCase().charAt(0).toUpperCase() + inputTitle.slice(1);
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