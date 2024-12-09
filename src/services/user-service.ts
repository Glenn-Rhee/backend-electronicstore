import { Order, Role } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  SetUserData,
} from "../model/user-model";
import { ResponseUser } from "../types/main";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/Validation";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Jwt } from "../lib/jwt";

export class UserService {
  static async register<T extends object, Te>(
    data: CreateUserRequest,
    authFrom: "dashboard" | "store" | undefined,
    tokenUser: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (tokenUser && tokenUser !== "undefined") {
      const dataToken = Jwt.verify(tokenUser);

      if (!dataToken) {
        throw new ResponseError(403, "Forbidden! Unathorize, Login first!");
      }

      const checkExp = Jwt.checkExp(dataToken.exp!);

      if (!checkExp) {
        throw new ResponseError(403, "Your session has expired, please login!");
      }

      throw new ResponseError(402, "You have been loged in");
    }

    let role: Role;
    if (!authFrom) {
      throw new ResponseError(500, "Please fill the query 'from'");
    } else {
      if (authFrom === "dashboard") role = "ADMIN";
      else role = "USER";
    }

    const dataUser = Validation.validate(UserValidation.REGISTER, data);

    const isRegister = await prismaClient.user.count({
      where: {
        email: dataUser.email,
      },
    });

    if (isRegister > 0) {
      throw new ResponseError(400, "Email already registered!");
    }

    dataUser.password = await bcrypt.hash(dataUser.password, 10);

    const user = await prismaClient.user.create({
      data: {
        id: "USR" + v4().slice(0, 5),
        role,
        email: dataUser.email,
        password: dataUser.password,
        username: dataUser.username,
      },
    });

    const token = Jwt.sign({ email: user.email, id: user.id, role: user.role });

    if (user.role === "ADMIN") {
      await prismaClient.settings.create({
        data: {
          id: v4(),
          userId: user.id,
          revenue: "ABLE",
          users: "ABLE",
          sales: "ABLE",
          orders: "ABLE",
        },
      });
    }

    await prismaClient.userDetail.create({
      data: {
        id: v4(),
        userId: user.id,
        fullname: dataUser.fullname,
        gender: dataUser.gender,
        dateOfBirth: new Date(dataUser.dateOfBirth).toISOString(),
        phone: dataUser.phone,
        address: "",
      },
    });

    return {
      message: "Successfully create one user",
      statusCode: 201,
      status: "success",
      data: {
        id: user.id,
        token,
      } as T,
    };
  }

  static async login<T extends object, Te>(
    data: LoginUserRequest,
    token: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (token && token !== "undefined") {
      const dataToken = Jwt.verify(token);
      if (!dataToken) {
        throw new ResponseError(403, "Forbidden! Unathorize, Login first!");
      }
      const checkExp = Jwt.checkExp(dataToken.exp!);

      if (!checkExp) {
        throw new ResponseError(403, "Your session has expired, please login!");
      }

      throw new ResponseError(402, "You have been loged in");
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new ResponseError(404, "Email not registered!");
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new ResponseError(401, "Password doesn't match!");
    }

    const tokenUser = Jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "Successfully login!",
      status: "success",
      statusCode: 201,
      data: {
        id: user.id,
        token: tokenUser,
      } as T,
    };
  }

  static async getUserOrder<T extends object, Te>(
    userId: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(403, "Forbidden!");
    }

    const dataUser = await prismaClient.user.findFirst({
      where: { id: userId },
    });

    if (!dataUser || dataUser.role === "USER") {
      throw new ResponseError(403, "Forbidden! You don't have any access!");
    }

    let dataUserOrder: Order[] | [];

    const dataStore = await prismaClient.store.findFirst({ where: { userId } });
    if (!dataStore) {
      dataUserOrder = [];
    } else {
      dataUserOrder = await prismaClient.order.findMany({
        where: { storeId: dataStore.id },
      });
    }

    return {
      message: "Successfully get user orders",
      status: "success",
      statusCode: 200,
      data: dataUserOrder as T,
    };
  }

  static async getUserData<T extends object, Te>(
    userId: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(403, "Forbidden!! Token is required");
    }

    const dataUser = await prismaClient.user.findFirst({
      where: { id: userId },
    });

    if (!dataUser) {
      throw new ResponseError(
        404,
        "Oops user you are looking for is not found!"
      );
    }

    const dataUserDetail = await prismaClient.userDetail.findFirst({
      where: { userId: dataUser.id },
    });

    if (!dataUserDetail) {
      throw new ResponseError(
        404,
        "Oops user detail you are looking for is not found!"
      );
    }

    const dataResponse = {
      id: dataUser.id,
      username: dataUser.username,
      email: dataUser.email,
      fullname: dataUserDetail.fullname,
      gender: dataUserDetail.gender,
      dataOfBirth: dataUserDetail.dateOfBirth,
      phone: dataUserDetail.phone,
      address: dataUserDetail.address,
      sosmed: dataUserDetail.sosmed,
    };

    return {
      message: "Successfully get user data",
      status: "success",
      statusCode: 201,
      data: dataResponse as T,
    };
  }

  static async setUserData(idUser: string, data: SetUserData): Promise<void> {
    const dataUser = await prismaClient.user.update({
      where: { id: idUser },
      data: {
        email: data.email,
        username: data.username,
      },
    });

    await prismaClient.userDetail.update({
      where: { userId: dataUser.id },
      data: {
        phone: data.phone,
        address: data.address,
        sosmed: data.sosmed,
      },
    });

  }
}
