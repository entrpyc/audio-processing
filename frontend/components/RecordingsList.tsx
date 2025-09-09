import { Card, Flex, Loader, Stack, Text } from "@mantine/core"
import css from '@/styles/global.module.css';
import { ZoomRecording } from "@/types/types";

type RecordingListProps = {
  loading?: boolean
  onRecordingClick?: (recording: ZoomRecording) => void,
  recordings?: ZoomRecording[],
  disabled?: boolean,
  selectedRecording: ZoomRecording | undefined,
}

export default function RecordingsList ({
  loading,
  onRecordingClick,
  recordings,
  disabled,
  selectedRecording
}: RecordingListProps) {
  if(loading) return (
    <Flex justify="center" align="center">
      <Loader color="blue" />
    </Flex>
  )

  if(!recordings?.length) return (
    <Flex justify="center" align="center">
      <Text>No recordings found</Text>
    </Flex>
  )

  return (
    <Stack gap={10}>
      {recordings?.map(item => (
        <Card
          className={`${css.cardHover} ${item.id === selectedRecording?.id && css.cardSelected} ${disabled && css.disabled}`}
          key={item.id}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          onClick={() => onRecordingClick?.(item)}
        >
          <Text c="dimmed">{item.id === selectedRecording?.id ? '✅' : '🎬'} {item.date}{item.id === selectedRecording?.id ? ' (selected)' : ''}</Text>
        </Card>
      ))}
    </Stack>
  )
}