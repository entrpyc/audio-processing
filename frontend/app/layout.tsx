import '@mantine/core/styles.css'; 
import '@mantine/dates/styles.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

export const metadata = {
  title: 'Audio Upload',
  description: 'App for audio compression, volume normalization, and speech optimization. Send files directly to a Telegram group or channel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="auto"
          theme={{
            fontFamily: 'sans-serif',
            defaultRadius: 'sm',
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
