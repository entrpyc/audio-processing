import '@mantine/core/styles.css'; 
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: 'Audio Processing',
  description: 'App for audio compression, volume normalization, and speech optimization. Send files directly to a Telegram group or channel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider
          defaultColorScheme="auto"
          theme={{
            fontFamily: 'sans-serif',
            defaultRadius: 'sm',
          }}
        >
            <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
