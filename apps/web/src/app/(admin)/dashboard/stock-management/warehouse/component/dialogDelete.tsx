'use client';
import { useDeleteProductWarehouseMutation } from '@/hooks/useWarehouseStockMutation';
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
import { useRef } from 'react';
type props = {
  isOpenDialog: boolean;
  onCloseDialog: () => void;
  currentIdModal: number;
};
export default function DialogDelete({
  isOpenDialog,
  onCloseDialog,
  currentIdModal,
}: props) {
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const { mutate: deleteStock } = useDeleteProductWarehouseMutation();
  const handleDelete = () => {
    if (currentIdModal) {
      const id = Number(currentIdModal);
      deleteStock(id, {
        onSuccess: () => {
          onCloseDialog();
        },
      });
    }
  };
  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onCloseDialog}
        isOpen={isOpenDialog}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Warning</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Are you sure want to delete it?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onCloseDialog}>
              No
            </Button>
            <Button ml={3} onClick={handleDelete}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
