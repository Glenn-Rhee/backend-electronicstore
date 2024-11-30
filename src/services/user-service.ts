import { Role } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { CreateUserRequest, LoginUserRequest } from "../model/user-model";
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
}
