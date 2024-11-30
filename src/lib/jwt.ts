import jwt from "jsonwebtoken";
import "dotenv/config";
import { Role } from "@prisma/client";

interface Payload extends jwt.JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export class Jwt {
  static sign(data: { id: string; email: string; role: Role }) {
    return jwt.sign(data, process.env.PRIVATE_KEY!, {
      algorithm: "HS384",
      expiresIn: "1h",
    });
  }

  static verify(token: string) {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY!) as Payload;

    return decoded;
  }

  static checkExp(exp: number) {
    const expiredDate = new Date(exp * 1000);
    const dateNow = new Date();

    return expiredDate > dateNow;
  }
}
