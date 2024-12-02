import { Response } from "express";

export class Cookie {
  static setCookie(res: Response, token: string) {
    res.cookie("xtr", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 jam
    });
  }

  static removeCookie(res: Response) {
    res.clearCookie("xtr", {
      httpOnly: true,
      sameSite: "strict",
    });
  }

  static updateCookie(res: Response, token: string) {
    this.setCookie(res, token);
  }
}
