import { Product } from "@prisma/client";

export interface CreateProduct {
  productName: string;
  category: Product["category"];
  brand: string;
  description: string;
  urlImage: string;
  price: number;
  stock: number;
  discount: number;
  tag: string;
}
