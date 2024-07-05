import { useCancelProductMutation } from '@/hooks/useMutateMutation';
import { Button, useDisclosure } from '@chakra-ui/react';
import Dialog from '@/components/dialog/Dialog';
type props = {
  id: number;
};

export default function ButtonCancel({ id }: props) {
  const text = 'Are you sure want to cancel this request?';
  const { mutate: cancelReq } = useCancelProductMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCancelRequest = (): void => {
    if (id) {
      cancelReq(id);
    }
  };
  return (
    <>
      <Dialog
        text={text}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleCancelRequest}
        color="yellow"
      />
      <Button colorScheme={'yellow'} size={'sm'} onClick={onOpen}>
        Cancel
      </Button>
    </>
  );
}
