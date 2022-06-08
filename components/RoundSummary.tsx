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

  console.log(`---------------- stats:  `, data);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>The Battle is Done.</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {isLoading ? <Spinner size="xl" /> : null}
            {!isLoading ? (
              <Box>
                <Heading size="xl">GAME OVER</Heading>
              </Box>
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
