import { Product, Tags } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { ResponseUser } from "../types/main";
import { CreateProduct } from "../model/product-model";
import { getId } from "../lib/getId";

export default class ProductService {
  static async getProducts<T extends object, Te>(
    userId: string | undefined,
    productId: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(403, "Forbidden! Token is required!");
    }

    if (productId) {
      const dataProduct = await prismaClient.product.findFirst({
        where: { id: productId },
      });

      const dataTags = await prismaClient.tags.findFirst({
        where: {
          productId,
        },
      });

      if (!dataTags) throw new ResponseError(404, "Tags not found!");

      const tags = { id: dataTags.id, tagName: dataTags.tagName };

      return {
        status: "success",
        statusCode: 200,
        message: "Successfully get product",
        data: { ...dataProduct, tag: tags } as T,
      };
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

    const dataProduct = await prismaClient.product.create({
      data: {
        id: getId("PRD"),
        storeId: storeUser.id,
        ...restData,
      },
    });

    const dataTag = await prismaClient.tags.create({
      data: {
        id:
          getId("TG") + (Math.random() * 1000 + Math.random() * 10).toString(),
        productId: dataProduct.id,
        tagName: tag,
      },
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

  static async updateProduct<T extends object, Te>(
    idUser: string | undefined,
    data: CreateProduct,
    {
      idProduct,
      idTag,
    }: {
      idProduct: string | undefined;
      idTag: string | undefined;
    }
  ): Promise<ResponseUser<T, Te>> {
    if (!idUser) throw new ResponseError(403, "Forbidden! Token is required!");

    if (!idProduct) throw new ResponseError(404, "Id Product is required!");

    if (!idTag) throw new ResponseError(404, "Id Tag is required!");

    const dataProduct = await prismaClient.product.findFirst({
      where: {
        id: idProduct,
      },
    });

    if (!dataProduct) throw new ResponseError(404, "Product not found!");

    const { tag, ...restData } = data;

    const updatedDataProduct = await prismaClient.product.update({
      where: {
        id: idProduct,
      },
      data: {
        ...restData,
      },
    });

    await prismaClient.tags.update({
      where: {
        id: idTag,
      },
      data: {
        tagName: tag,
      },
    });

    return {
      status: "success",
      statusCode: 200,
      message: "Successfully update product",
      data: {
        ...updatedDataProduct,
      } as T,
    };
  }
}
