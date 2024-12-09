import { v4 } from "uuid";
import { prismaClient } from "../app/database";

export default class BankService {
  static async setBank(data: {
    id: string;
    bankName: string;
    accountNumber: string;
  }) {
    await prismaClient.bank.update({
      where: { id: data.id },
      data: {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
      },
    });
  }

  static async createBank(data: { bankName: string; accountNumber: string }) {
    const dataBank = await prismaClient.bank.create({
      data: {
        id: v4(),
        bankName: data.bankName,
        accountNumber: data.accountNumber,
      },
    });

    return dataBank;
  }
}
