import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

export type CountdownTimerProps = {
  count: number;
  max: number;
};

export const CountdownTimer = ({ count, max }: CountdownTimerProps) => {
  return (
    <CircularProgress value={count} min={1} max={max} size="75px">
      <CircularProgressLabel>{count}</CircularProgressLabel>
    </CircularProgress>
  );
};
