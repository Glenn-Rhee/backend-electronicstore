import { Order } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { ResponseUser } from "../types/main";

export default class OrderService {
  static async getOrder<T extends object, Te>(
    userId: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(403, "Forbidden! Token is required!");
    }

    const dataUser = await prismaClient.user.findFirst({
      where: { id: userId },
    });

    if (!dataUser || dataUser.role === "USER") {
      throw new ResponseError(403, "Forbidden!! You don't have any access!");
    }

    const dataStore = await prismaClient.store.findFirst({ where: { userId } });
    let dataOrders: Order[] | [];
    if (!dataStore) {
      dataOrders = [];
    } else {
      dataOrders = await prismaClient.order.findMany({
        where: { storeId: dataStore.id },
      });
    }

    return {
      status: "success",
      statusCode: 200,
      message: "Successfully get orders from user!",
      data: dataOrders as T,
    };
  }
}
