import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { getId } from "../lib/getId";
import { SetStoreRequest } from "../model/store-model";
import { ResponseUser } from "../types/main";
import BankService from "./bank-service";
import { UserService } from "./user-service";

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

  static async setStore<T extends object, Te>(
    userId: string | undefined,
    data: SetStoreRequest
  ): Promise<ResponseUser<T, Te>> {
    console.log(data);
    if (!userId) {
      throw new ResponseError(403, "Forbidden id user is required!");
    }

    await UserService.setUserData(userId, data);

    let dataStore = await prismaClient.store.findFirst({ where: { userId } });

    if (dataStore) {
      await BankService.setBank({
        id: dataStore.bankId,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
      });

      dataStore = await prismaClient.store.update({
        where: { userId },
        data: {
          storeName: data.storeName,
          storeDescription: data.storeDescription,
          openStore: data.openStore,
          closeStore: data.closeStore,
          urlImage: data.urlImage,
        },
      });
    } else {
      const dataBank = await BankService.createBank({
        accountNumber: data.accountNumber,
        bankName: data.bankName,
      });

      dataStore = await prismaClient.store.create({
        data: {
          id: getId("ST"),
          storeName: data.storeName,
          storeDescription: data.storeDescription,
          storeCategory: data.storeCategory,
          openStore: data.openStore,
          closeStore: data.closeStore,
          urlImage: data.urlImage,
          bankId: dataBank.id,
          userId,
        },
      });
    }

    return {
      status: "success",
      statusCode: 200,
      message: "Successfully set store data",
      data: dataStore as T,
    };
  }
}
