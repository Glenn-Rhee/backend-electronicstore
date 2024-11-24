import { Role } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { CreateUserRequest } from "../model/user-model";
import { ResponseUser } from "../types/main";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/Validation";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Jwt } from "../lib/jwt";

export class UserService {
  static async register<T extends object, Te>(
    data: CreateUserRequest,
    authFrom: "dashboard" | "store" | undefined
  ): Promise<ResponseUser<T, Te>> {
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
        ...dataUser,
      },
    });

    const token = Jwt.sign({ email: user.email, id: user.id });

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
}
