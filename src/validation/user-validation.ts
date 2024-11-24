import { z, ZodType } from "zod";
import { CreateUserRequest } from "../model/user-model";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    fullname: z.string(),
    gender: z.enum(["MALE", "FEMALE"], {
      message: 'Invalid gender, gender must be "MALE" or "FEMALE"',
    }),
    dateOfBirth: z.date({ message: "Invalid type of date of birth" }),
    phone: z.string().min(10, { message: "Invalid phone number" }),
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  });
}
