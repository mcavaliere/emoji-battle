import {
  Avatar,
  Button,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Stat,
  StatLabel,
  StatGroup,
  StatNumber,
  Tbody,
  TableContainer,
  Table,
  TableCaption,
  Tr,
  Td,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '../../lib/api/rounds';
import * as Constants from '../../lib/constants';

export type RoundSummaryProps = {
  onClose: () => void;
  roundId: number;
};

export const RoundSummary = ({ onClose, roundId }) => {
  const { isLoading, data } = useQuery(
    [Constants.QUERY_CACHE_KEYS.ROUND_SUMMARY],
    () => fetchStats(roundId)
  );

  console.log(`---------------- data: `, data);

  const roundStats = data?.stats?.round;
  const userStats = data?.stats?.users;
  const emojiStats = data?.stats?.emoji;
  const emojiMap = data?.emojiMap;
  const userMap = data?.userMap;

  return (
    <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />

          <ModalBody>
            {isLoading ? <Spinner size="xl" /> : null}
            {!isLoading ? (
              <>
                <Heading size="xl" textAlign="center" mb={5}>
                  GAME OVER
                </Heading>

                <StatGroup textAlign="center">
                  <Stat>
                    <StatLabel>Total Votes</StatLabel>
                    <StatNumber>{roundStats?.votes}</StatNumber>
                  </Stat>
                </StatGroup>

                <Flex direction="row">
                  <TableContainer>
                    <Table>
                      <TableCaption placement="top">Top Emoji</TableCaption>
                      <Tbody>
                        {emojiStats?.map(([id, count]) => (
                          <Tr key={id}>
                            <Td>{emojiMap[id].native}</Td>
                            <Td>{count}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <TableContainer>
                    <Table>
                      <TableCaption placement="top">Top Battlers</TableCaption>
                      <Tbody>
                        {userStats.map(([id, count]) => (
                          <Tr key={id}>
                            <Td verticalAlign="center">
                              <Flex direction="row" align="center">
                                <Avatar
                                  src={userMap[id].image}
                                  size="xs"
                                  mr={2}
                                />{' '}
                                {userMap[id].name}{' '}
                              </Flex>
                            </Td>
                            <Td>{count} votes</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Flex>
              </>
            ) : null}
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
