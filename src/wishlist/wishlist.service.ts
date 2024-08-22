import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async getWishListPage(
    userId: string,
    query: string,
    page: number,
    limit: number,
  ) {
    const numOfData = await this.getWishListNumber(userId, query);
    const maxPage = Math.max(1, Math.ceil(numOfData / limit));

    if (page > maxPage || page < 1) {
      throw new BadRequestException();
    }

    if (limit < 8 || limit > 50) {
      throw new BadRequestException();
    }

    let lowerPage = Math.max(1, page - 2);
    let upperPage = Math.min(maxPage, page + 2);

    if (page === 1 || page === 2) {
      upperPage = Math.min(maxPage, 5);
    } else if (page === maxPage) {
      lowerPage = Math.max(1, maxPage - 4);
    } else if (page === maxPage - 1) {
      lowerPage = Math.max(1, maxPage - 3);
    }

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const films = await this.getWishListByCursor(userId, page, limit, query);
    return {
      films,
      page,
      lowerPage,
      upperPage,
      maxPage,
      query,
      user: {
        username: user.username,
        balance: user.balance,
        email: user.email,
      },
    };
  }
  async createWishList(userId: string, filmId: string) {
    try {
      const data = await this.prisma.wishList.create({
        data: {
          filmId,
          userId,
        },
      });

      return {
        message: 'Film added successfully',
        status: 'success',
        data,
      };
    } catch (error) {
      throw new ConflictException('Film has been added to wishlist before');
    }
  }

  async removeWishList(userId: string, filmId: string) {
    try {
      const data = await this.prisma.wishList.delete({
        where: {
          userId_filmId: {
            userId,
            filmId,
          },
        },
      });
      return {
        message: 'Film removed successfully',
        status: 'success',
        data,
      };
    } catch (error) {
      throw new ConflictException('Film has never been added to wishlist');
    }
  }

  async getFilmInWishList(userId: string, filmId: string) {
    return await this.prisma.wishList.findUnique({
      where: {
        userId_filmId: {
          userId,
          filmId,
        },
      },
    });
  }

  async getWishListNumber(userId: string, query: string) {
    return await this.prisma.wishList.count({
      where: {
        userId,
        film: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              director: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      },
    });
  }

  async getWishList(userId: string, query: string) {
    const userWithFilms = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        wishList: {
          where: {
            film: {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  director: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
          include: {
            film: true,
          },
        },
      },
    });

    const films = userWithFilms?.wishList.map((relation) => relation.film);
    return films;
  }

  async getWishListByCursor(
    userId: string,
    cursor: number,
    limit: number,
    query: string,
  ) {
    const userWithFilms = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        wishList: {
          where: {
            film: {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  director: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
          include: {
            film: true,
          },
          skip: limit * (cursor - 1),
          take: limit,
        },
      },
    });

    const films = userWithFilms?.wishList.map((relation) => relation.film);
    return films;
  }
}
