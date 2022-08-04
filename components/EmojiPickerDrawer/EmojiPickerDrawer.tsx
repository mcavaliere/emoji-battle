import React from 'react';
import {
  Button,
  Center,
  CloseButton,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from '@chakra-ui/react';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';

export type EmojiPickerDrawerProps = {};

/** Description of component */
export function EmojiPickerDrawer({}: EmojiPickerDrawerProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <>
      <Drawer
        placement="bottom"
        onClose={onClose}
        isOpen={isOpen}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <DrawerContent borderRadius="lg" boxShadow="md">
          <DrawerBody>
            <Center>
              <EmojiPicker />
            </Center>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
