import { Flex, CircularProgress, Text } from '@chakra-ui/react';

export type CountdownTimerProps = {
  count: number;
  max: number;
};

export const CountdownTimer = ({ count, max }: CountdownTimerProps) => {
  return (
    <Flex pos="relative">
      <CircularProgress value={count} min={1} max={max} />

      <Flex pos="absolute" w="100%" h="100%" align="center" justify="center">
        <Text>{count}</Text>
      </Flex>
    </Flex>
  );
};
