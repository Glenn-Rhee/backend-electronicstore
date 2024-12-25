import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { ResponseUser } from "../types/main";

export default class SettingsService {
  static async getSettingsUser<T extends object, Te>(
    userId: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(403, "Forbidden! Token is required!");
    }

    const dataUser = await prismaClient.user.findFirst({
      where: { id: userId },
    });

    if (!dataUser || dataUser.role === "USER") {
      throw new ResponseError(403, "Forbidden! You don't have any access!");
    }

    const dataSettings = await prismaClient.settings.findFirst({
      where: { userId },
    });

    return {
      message: "Successfully get settings",
      status: "success",
      statusCode: 200,
      data: dataSettings as T,
    };
  }

  static async setSettingsUser<T extends object, Te>(
    userId: string | undefined,
    data: T
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(403, "Forbidden! Token is required!");
    }

    const dataSetting = await prismaClient.settings.findFirst({
      where: {
        userId,
      },
    });

    if (!dataSetting) {
      throw new ResponseError(404, "Unknown User!");
    }

    await prismaClient.settings.update({
      where: {
        userId,
      },
      data: {
        ...data,
      },
    });

    return {
      message: "Successfully set settings",
      status: "success",
      statusCode: 200,
    };
  }
}
