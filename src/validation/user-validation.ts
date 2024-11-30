import { z, ZodType } from "zod";
import parsePhoneNumberFromString from "libphonenumber-js";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    fullname: z.string(),
    gender: z.enum(["MALE", "FEMALE"], {
      message: 'Invalid gender, gender must be "MALE" or "FEMALE"',
    }),
    dateOfBirth: z.string().date("Invalid date of birth"),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 " })
      .refine((value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber && phoneNumber.isValid();
      }),
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  });
}
