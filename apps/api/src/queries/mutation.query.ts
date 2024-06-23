import { reqMutation, respMutation } from '@/interfaces/mutation.interface';
import prisma from '@/prisma';
import { Mutation } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class MutationQuery {
  public requestMutationProductQuery = async (
    params: reqMutation,
  ): Promise<Mutation> => {
    try {
      const {
        receiverWarehouseId,
        senderWarehouseId,
        bookId,
        qty,
        senderName,
        senderNotes,
      } = params;
      const t = await prisma.$transaction(async () => {
        try {
          const mutation = await prisma.mutation.create({
            data: {
              book_id: bookId,
              to_warehouse_id: receiverWarehouseId,
              from_warehouse_id: senderWarehouseId,
              quantity: qty,
              status: 'PROCESSED',
              sender_notes: senderNotes,
              sender_name: senderName,
            },
          });
          return mutation;
        } catch (error) {
          throw error;
        }
      });
      return t;
    } catch (error) {
      throw error;
    }
  };

  public acceptMutationQuery = async (
    params: respMutation,
  ): Promise<Mutation> => {
    try {
      const t = await prisma.$transaction(async () => {
        try {
          const { id, receiverName, receiverNotes = null } = params;
          const mutation = await prisma.mutation.update({
            where: {
              id,
            },
            data: {
              status: 'COMPLETED',
              receiver_name: receiverName,
              receiver_notes: receiverNotes,
            },
          });
          return mutation;
        } catch (error) {
          throw error;
        }
      });
      return t;
    } catch (error) {
      throw error;
    }
  };

  public findMutationOnProcessedQuery = async (id: number) => {
    try {
      const find = await prisma.mutation.findFirst({
        where: {
          id,
          status: 'PROCESSED',
        },
      });
      return find;
    } catch (error) {
      throw error;
    }
  };

  public rejectMutationQuery = async (params: respMutation) => {
    try {
      const t = await prisma.$transaction(async () => {
        try {
          const { id, receiverNotes = null, receiverName } = params;
          const mutation = await prisma.mutation.update({
            where: {
              id,
            },
            data: {
              receiver_name: receiverName,
              receiver_notes: receiverNotes,
              status: 'REJECTED',
            },
          });
          return mutation;
        } catch (error) {
          throw error;
        }
      });
      return t;
    } catch (error) {
      throw error;
    }
  };
  public cancelMutationQuery = async (mutationId: number) => {
    try {
      const t = await prisma.$transaction(async () => {
        try {
          const mutation = await prisma.mutation.update({
            where: {
              id: mutationId,
            },
            data: {
              status: 'CANCELED',
            },
          });
          return mutation;
        } catch (error) {
          throw error;
        }
      });
      return t;
    } catch (error) {
      throw error;
    }
  };

  public getAllMutationQuery = async () => {
    try {
      const data = await prisma.mutation.findMany({});
      return data;
    } catch (error) {
      throw error;
    }
  };
}
