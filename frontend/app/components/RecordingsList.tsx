import { Card, Flex, Loader, Stack, Text } from "@mantine/core"
import css from '../style/styles.module.css';
import { ZoomRecording } from "../types/types";

type RecordingListProps = {
  loading?: boolean
  onRecordingClick?: (recording: ZoomRecording) => void,
  recordings?: ZoomRecording[],
  disabled?: boolean,
}

export default function RecordingsList ({
  loading,
  onRecordingClick,
  recordings,
  disabled,
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
          className={`${css.cardHover} ${item.selected && css.cardSelected} ${disabled && css.disabled}`}
          key={item.id}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          onClick={() => onRecordingClick?.(item)}
        >
          <Text c="dimmed">{item.selected ? '✅' : '🎬'} {item.date}{item.selected ? ' (selected)' : ''}</Text>
        </Card>
      ))}
    </Stack>
  )
}