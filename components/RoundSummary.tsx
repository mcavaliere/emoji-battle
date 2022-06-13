import { useEffect } from 'react';
import {
  Box,
  Button,
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
  StatArrow,
  StatLabel,
  StatGroup,
  StatNumber,
  StatUpArrow,
  StatHelpText,
  StatDownArrow,
  Text,
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

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>The Battle is Done.</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {isLoading ? <Spinner size="xl" /> : null}
            {!isLoading ? (
              <>
                <Box>
                  <Heading size="xl">GAME OVER</Heading>
                </Box>
                <StatGroup>
                  <Stat>
                    <StatLabel>Total Votes</StatLabel>
                    <StatNumber>{roundStats?.votes}</StatNumber>
                  </Stat>
                </StatGroup>
                <TableContainer>
                  <Table>
                    {emojiStats.map(([id, count]) => (
                      <Tr key={id}>
                        <Td>{emojiMap[id].native}</Td>
                        <Td>{count}</Td>
                      </Tr>
                    ))}
                  </Table>
                </TableContainer>
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
