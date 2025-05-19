import { prismaClient } from "../app/database";
import { Product } from "../types/main";

export class RatingService {
  static async getRatingProducts(products: Product[]) {
    const productsWithRating = await Promise.all(
      products.map(async (p) => {
        const ratingCount = await prismaClient.rating.count({
          where: {
            id: p.id,
          },
        });

        const rating = await prismaClient.rating.findMany({
          where: {
            productId: p.id,
          },
          select: {
            rating: true,
          },
        });

        const totalRating = rating.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = ratingCount === 0 ? 0 : totalRating / ratingCount;
        return { ...p, ratingCount, avgRating };
      })
    );

    return productsWithRating;
  }

  static async getRatingProduct(productId: string) {
    const ratingCount = await prismaClient.rating.count({
      where: {
        id: productId,
      },
    });

    const rating = await prismaClient.rating.findMany({
      where: {
        productId,
      },
      select: {
        rating: true,
      },
    });

    const totalRating = rating.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = ratingCount === 0 ? 0 : totalRating / ratingCount;
    return { ratingCount, avgRating };
  }
}
