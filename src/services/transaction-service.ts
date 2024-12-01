import { Transaction } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseUser } from "../types/main";
import { ResponseError } from "../error/response-error";

export default class TransactionService {
  static async getTransaction<T extends object, Te>(
    userId: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(403, "Forbidden! Token is required!");
    }

    const dataUser = await prismaClient.user.findFirst({
      where: { id: userId },
    });

    if (!dataUser || dataUser.role === "USER") {
      throw new ResponseError(403, "Forbidden! You don't have any access!!");
    }
    let dataTransaction: Transaction[] | [];
    const dataStore = await prismaClient.store.findFirst({
      where: {
        userId,
      },
    });

    if (!dataStore) {
      dataTransaction = [];
    } else {
      dataTransaction = await prismaClient.transaction.findMany({
        where: {
          storeId: dataStore.id,
        },
      });
    }

    return {
      message: "Successfully get transaction",
      status: "success",
      statusCode: 200,
      data: dataTransaction as T,
    };
  }
}
