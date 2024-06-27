import { useRejectProductMutation } from '@/hooks/useMutateMutation';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';

type props = {
  id: number;
  userName: string;
};

export default function ButtonReject({ id, userName }: props) {
  const { mutate: rejectReq } = useRejectProductMutation();
  const handleRejectRequest = () => {
    const payload = {
      id,
      receiverName: userName,
      receiverNotes: initialRef?.current!.value || '',
    };
    rejectReq(payload);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'2xl'} color={'black'} opacity={'0.75'}>
            Are you sure want to reject this request?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Notes: (optional)</FormLabel>
              <Input ref={initialRef} placeholder="input your notes..." />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleRejectRequest}>
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button colorScheme={'red'} size={'sm'} mr={3} onClick={onOpen}>
        Reject
      </Button>
    </>
  );
}
