import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { ResponseUser } from "../types/main";

export default class StoreService {
  static async getStoreInfo<T extends object, Te>(
    idUser: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (!idUser) {
      throw new ResponseError(403, "Forbidden! Unknown user!");
    }

    const dataUser = await prismaClient.user.findFirst({
      where: { id: idUser },
    });

    if (!dataUser) {
      throw new ResponseError(404, "User not found!");
    }

    const dataStore = await prismaClient.store.findFirst({
      where: {
        userId: idUser,
      },
      select: {
        id: true,
        storeName: true,
        storeDescription: true,
        storeCategory: true,
        openStore: true,
        closeStore: true,
        urlImage: true,
        bankId: true,
      },
    });

    let dataBank: { bankName: string; accountNumber: string } | null = {
      accountNumber: "",
      bankName: "",
    };

    if (dataStore) {
      dataBank = await prismaClient.bank.findFirst({
        where: { id: dataStore.bankId },
        select: {
          accountNumber: true,
          bankName: true,
        },
      });

      if (!dataBank) {
        dataBank = { accountNumber: "", bankName: "" };
      }
    }

    const data = dataStore ? { ...dataStore, ...dataBank } : {};

    return {
      status: "success",
      statusCode: 200,
      message: "Successfully get store information",
      data: data as T,
    };
  }
}
