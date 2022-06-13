import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Stat,
  StatLabel,
  StatGroup,
  StatNumber,
  TableContainer,
  Table,
  TableCaption,
  Tr,
  Td,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { fetchStats } from '../lib/api/rounds';

export type RoundSummaryProps = {
  onClose: () => void;
  roundId: number;
};

export const RoundSummary = ({ onClose, roundId }) => {
  const { isLoading, data } = useQuery('round-summary', () =>
    fetchStats(roundId)
  );

  const roundStats = data?.stats?.round;
  const userStats = data?.stats?.users;
  const emojiStats = data?.stats?.emoji;
  const emojiMap = data?.emojiMap;
  const userMap = data?.userMap;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />

          <ModalBody>
            {isLoading ? <Spinner size="xl" /> : null}
            {!isLoading ? (
              <>
                <Box>
                  <Heading size="xl" textAlign="center">
                    GAME OVER
                  </Heading>
                </Box>
                <StatGroup>
                  <Stat>
                    <StatLabel>Total Votes</StatLabel>
                    <StatNumber>{roundStats?.votes}</StatNumber>
                  </Stat>
                </StatGroup>
                <Flex direction="row">
                  <TableContainer>
                    <Table>
                      <TableCaption placement="top">Top Emoji</TableCaption>
                      {emojiStats.map(([id, count]) => (
                        <Tr key={id}>
                          <Td>{emojiMap[id].native}</Td>
                          <Td>{count}</Td>
                        </Tr>
                      ))}
                    </Table>
                  </TableContainer>
                  <TableContainer>
                    <Table>
                      <TableCaption placement="top">Top Battlers</TableCaption>
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
                          <Td>{count}</Td>
                        </Tr>
                      ))}
                    </Table>
                  </TableContainer>
                </Flex>
              </>
            ) : null}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
