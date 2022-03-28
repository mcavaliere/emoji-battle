import { Box, CircularProgress, Text } from '@chakra-ui/react';

export type CountdownTimerProps = {
  count: number;
  max: number;
};

export const CountdownTimer = ({ count, max }) => {
  return (
    <CircularProgress value={count} min={1} max={max}>
      <Text>{count}</Text>
    </CircularProgress>
  );
};
