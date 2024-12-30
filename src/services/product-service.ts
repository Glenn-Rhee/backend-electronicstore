import { Product, Tags } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { ResponseUser } from "../types/main";
import { CreateProduct } from "../model/product-model";
import { getId } from "../lib/getId";

export default class ProductService {
  static async getProducts<T extends object, Te>(
    userId: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(403, "Forbidden! Token is required!");
    }

    const dataUser = await prismaClient.user.findFirst({
      where: { id: userId },
    });

    if (!dataUser || dataUser.role === "USER") {
      throw new ResponseError(403, "Forbidden! You don't have any access!");
    }

    let dataProducts: Product[] | [];
    const dataStore = await prismaClient.store.findFirst({
      where: { userId: dataUser.id },
    });

    if (!dataStore) {
      dataProducts = [];
    } else {
      dataProducts = await prismaClient.product.findMany({
        where: { storeId: dataStore.id },
      });
    }

    return {
      status: "success",
      message: "Successfully get products",
      statusCode: 200,
      data: dataProducts as T,
    };
  }

  static async createProduct<T extends object, Te>(
    userId: string | undefined,
    data: CreateProduct
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) throw new ResponseError(403, "Forbidden! Token is required!");

    const storeUser = await prismaClient.store.findFirst({
      where: {
        userId,
      },
    });

    if (!storeUser) {
      throw new ResponseError(
        404,
        "Oops! Store not found! Please set a store first!"
      );
    }

    const { tag, ...restData } = data;

    let tags = tag.split(",");
    tags = tags
      .map((item) => item.trim())
      .map((item) => item.toLowerCase())
      .join(" ")
      .split(" ")
      .filter((item) => item !== "");

    tags = [...new Set(tags)];

    const dataProduct = await prismaClient.product.create({
      data: {
        id: getId("PRD"),
        storeId: storeUser.id,
        ...restData,
      },
    });

    const dataTag = await prismaClient.tags.createMany({
      data: tags.map<Tags>((tag, i) => {
        return {
          id: getId("TG") + (Math.random() * 1000 + i).toString(),
          productId: dataProduct.id,
          tagName: tag,
        };
      }),
    });

    return {
      status: "success",
      statusCode: 201,
      message: "Successfully create product",
      data: {
        ...dataProduct,
        ...dataTag,
      } as T,
    };
  }
}
