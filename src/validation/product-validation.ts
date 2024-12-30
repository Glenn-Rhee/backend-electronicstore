import { z, ZodType } from "zod";

export default class ProductValidation {
  static readonly CREATEPRODUCT: ZodType = z.object({
    productName: z
      .string({ message: "Invalid product name" })
      .min(1, "Product name must be at least 1 character"),
    category: z.enum(["LAPTOP", "ACCESSORIES"], {
      message: "Categorry must be LAPTOP or ACCESSORIES",
    }),
    brand: z
      .string({ message: "Invalid type of brand" })
      .min(1, "Brand name must be at least 1 character"),
    description: z
      .string({ message: "Invalid type of description" })
      .min(1, "Description must be at least 1 character"),
    urlImage: z.string({ message: "Invalid type of image url" }),
    price: z.number({ message: "Invalid type of price" }),
    stock: z
      .number({ message: "Invalid type of stock" })
      .min(1, "Stock must be at least 1"),
    discount: z
      .number({ message: "Invalid type of discount" })
      .max(100, "Discount must be less than 100"),
    tag: z
      .string({ message: "Invalid type of tag" })
      .min(1, "Tag name must be at least 1 character"),
  });
}
