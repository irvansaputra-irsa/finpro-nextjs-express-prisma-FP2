'use client';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React, { MouseEventHandler } from 'react';

export type Dialog = {
  text: string;
  handleSubmit: MouseEventHandler;
  isOpen: boolean;
  onClose: any;
  color?: string;
};

export default function Dialog({
  text,
  handleSubmit,
  isOpen,
  onClose,
  color = 'green',
}: Dialog) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Warning</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{text}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button colorScheme={color} ml={3} onClick={handleSubmit}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
