import parsePhoneNumberFromString from "libphonenumber-js";
import { z, ZodType } from "zod";

export default class StoreValidation {
  static readonly SETSTORE: ZodType = z.object({
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 " })
      .refine((value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber && phoneNumber.isValid();
      }),
    email: z.string().email({ message: "Invalid email address" }),
    address: z.string({ message: "Invalid address" }),
    sosmed: z.string({ message: "Invalid type of social media" }),
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" }),
    fullname: z.string({ message: "Invalid type of fullname" }),
    storeName: z.string({ message: "Invalid type of store name" }),
    storeDescription: z.string({
      message: "Invalid type of store description",
    }),
    storeCategory: z.enum(["LAPTOP", "ACCESSORIES"]),
    openStore: z.string({ message: "Invalid type of open Store" }),
    closeStore: z.string({ message: "Invalid type of close Store" }),
    bankName: z.string({ message: "Invalid type of bank name" }),
    accountNumber: z.string({ message: "Invalid type of account number" }),
    urlImage: z.string({ message: "Invalid url image" }),
  });
}
