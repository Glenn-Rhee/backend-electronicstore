import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { getId } from "../lib/getId";
import { RequestBody } from "../model/cart-model";
import { ResponseUser } from "../types/main";

export class CartService {
  public static async createCart<T extends object, Te>(
    userId: string | undefined,
    cartData: RequestBody
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(404, "Oops id User is required!");
    }

    const product = await prismaClient.product.findFirst({
      where: {
        id: cartData.productId,
      },
    });

    if (!product) {
      throw new ResponseError(404, "Oops product is not found!");
    }

    await prismaClient.cart.create({
      data: {
        id: getId("CT"),
        productId: product.id,
        userId,
      },
    });

    return {
      status: "success",
      statusCode: 201,
      message: "Successfully create Cart!",
    };
  }

  public static async getCart<T extends object, Te>(
    userId: string | undefined
  ): Promise<ResponseUser<T, Te>> {
    if (!userId) {
      throw new ResponseError(404, "Oops id user is required!");
    }

    const userCarts = await prismaClient.cart.findMany({
      where: {
        userId,
      },
    });

    if (userCarts.length === 0) {
      return {
        status: "success",
        statusCode: 201,
        message: "Sucessfully get carts user!",
        data: userCarts as T,
      };
    }

    const products = await Promise.all(
      userCarts.map(async (cart) => {
        const product = await prismaClient.product.findFirst({
          where: { id: cart.productId },
        });

        return {
          idCart: cart.id,
          ...product,
        };
      })
    );

    return {
      status: "success",
      statusCode: 201,
      message: "Sucessfully get carts user!",
      data: products as T,
    };
  }
}
