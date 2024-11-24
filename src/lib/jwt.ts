import jwt from "jsonwebtoken";
import "dotenv/config";

export class Jwt {
  static sign(data: { id: string; email: string }) {
    return jwt.sign(data, process.env.PRIVATE_KEY!, {
      algorithm: "HS384",
      expiresIn: "3h",
    });
  }

  static verify(token: string) {
    const decoded = jwt.verify(
      token,
      process.env.PRIVATE_KEY!
    ) as jwt.JwtPayload;

    return decoded;
  }

  static checkExp(exp: number) {
    const expiredDate = new Date(exp * 1000);
    const dateNow = new Date();

    return expiredDate < dateNow;
  }
}
