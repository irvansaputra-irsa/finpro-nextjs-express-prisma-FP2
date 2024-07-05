import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

type props = {
  senderName: string;
  senderNotes: string;
  receiverName?: string | null;
  receiverNote?: string | null;
};

export default function ButtonDetail({
  senderName,
  senderNotes,
  receiverName = '',
  receiverNote = '',
}: props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>Mutation Detail</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={3}>
              <Heading size={'md'}>Sender request name:</Heading>
              <Text>{senderName}</Text>
            </Box>
            <Box mb={3}>
              <Heading size={'md'}>Sender note:</Heading>
              <Text>{senderNotes}</Text>
            </Box>
            {receiverName && (
              <Box mb={3}>
                <Heading size={'md'}>Receiver request name:</Heading>
                <Text>{receiverName}</Text>
              </Box>
            )}
            {receiverNote && (
              <Box mb={3}>
                <Heading size={'md'}>Receiver note:</Heading>
                <Text>{receiverNote}</Text>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button size={'sm'} colorScheme="gray" onClick={onOpen}>
        Detail
      </Button>
    </>
  );
}
