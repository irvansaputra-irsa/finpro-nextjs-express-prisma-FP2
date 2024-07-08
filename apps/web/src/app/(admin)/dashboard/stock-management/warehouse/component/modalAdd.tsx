import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FormEvent } from 'react';
type props = {
  isOpen: boolean;
  onClose: () => void;
  initialRef: React.RefObject<HTMLInputElement>;
  handleSubmit: (e: FormEvent) => void;
  isDelete: boolean;
};
export default function ModalStock({
  isOpen,
  onClose,
  initialRef,
  handleSubmit,
  isDelete,
}: props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialRef}
      isCentered
    >
      <form onSubmit={(e) => handleSubmit(e)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isDelete ? 'Remove stock' : 'Add stock'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                min={1}
                name="stockAdd"
                id="stockAdd"
                ref={initialRef}
              />
              <FormHelperText color={'black.600'}>
                Please input it correctly.
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant={'ghost'}
              colorScheme="white"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button type="submit" colorScheme="orange">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
