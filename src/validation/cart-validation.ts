import { z, ZodType } from "zod";

export class CartValidation {
  static readonly CREATE: ZodType = z.object({
    productId: z.string(),
    quantity: z.number().min(1, { message: "Minimum of quantity is 1" }),
  });
}
