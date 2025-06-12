'use client';

import { useState } from 'react';
import { Button, Checkbox, FileInput, Radio, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

function formatTitle(inputDate: string, inputTitle: string) {  
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

  const formattedName = inputTitle.toLowerCase().charAt(0).toUpperCase() + inputTitle.slice(1);
  const title = `${formattedName} - ${formattedDate}`;
  const fileName = `${title}.mp3`;

  return fileName;
}

const downloadFile = async (res: Response, name: string) =>{
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

export default function AudioUploadForm() {
  const [status, setStatus] = useState('');

  const form = useForm({
    initialValues: {
      audioFile: null as File | null,
      name: '',
      date: '',
      delivery: 'telegram'
    },

    validate: {
      audioFile: (value) => (value ? null : 'File is required'),
      name: (value) => (value ? null : 'Name is required'),
      date: (value) => (value ? null : 'Date is required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const formData = new FormData();
    formData.append('audio', values.audioFile as File);
    formData.append('name', values.name);
    formData.append('date', values.date);
    formData.append('sendToTelegram', (values.delivery === 'telegram').toString());
    
    setStatus('🚀 Uploading');

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_PROCESS_AUDIO_ENDPOINT ?? '', {
        method: 'POST',
        body: formData,
      });

      if(values.delivery === 'download') {
        downloadFile(res, formatTitle(values.date, values.name));
        setStatus(`✅ Downloaded successfully`);
        return;
      }

      const result = await res.text();
      setStatus(`✅ ${result}`);
    } catch (err: any) {
      setStatus(`❌ Upload failed: ${err.message}`);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <FileInput
          label="Audio File"
          placeholder="Select a file"
          withAsterisk
          accept="audio/*"
          {...form.getInputProps('audioFile')}
        />

        <TextInput
          label="Title"
          placeholder="What should be the title of this meeting?"
          withAsterisk
          {...form.getInputProps('name')}
        />

        <DateInput
          label="Date"
          placeholder="When was this meeting recorded?"
          withAsterisk
          valueFormat="YYYY-MM-DD"
          {...form.getInputProps('date')}
        />

        <Radio.Group
          label="Delivery method"
          withAsterisk
          {...form.getInputProps('delivery')}
        >
          <Stack gap={8}>
            <Radio value="telegram" label="Send to Telegram" />
            <Radio value="download" label="Download" />
          </Stack>
        </Radio.Group>

        <Button type="submit">Submit</Button>

        {status && <div>{status}</div>}
      </Stack>
    </form>
  );
}
