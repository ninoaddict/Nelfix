import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getReview(filmId: string) {
    return await this.prisma.filmReview.findMany({
      where: {
        filmId,
      },
      select: {
        user: {
          select: {
            username: true,
          },
        },
        userId: true,
        filmId: true,
        content: true,
        rating: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getReviewPair(userId: string, filmId: string) {
    return await this.prisma.filmReview.findUnique({
      where: {
        userId_filmId: {
          userId,
          filmId,
        },
      },
    });
  }

  async getReviewFilmsIds(userId: string) {
    const data = await this.prisma.filmReview.findMany({
      where: {
        userId,
      },
      select: {
        filmId: true,
      },
    });

    return data.map((val) => val.filmId);
  }

  async postReview(
    userId: string,
    filmId: string,
    content: string,
    rating: number,
  ) {
    try {
      const data = await this.prisma.filmReview.create({
        data: {
          userId,
          filmId,
          content,
          rating,
        },
      });
      return {
        data,
        message: 'Review posted sucsessfully',
        status: 'Success',
      };
    } catch (error) {
      throw new ConflictException('User has posted review before');
    }
  }

  async putReview(
    userId: string,
    filmId: string,
    content: string,
    rating: number,
  ) {
    try {
      const data = await this.prisma.filmReview.update({
        where: {
          userId_filmId: {
            userId,
            filmId,
          },
        },
        data: {
          content,
          rating,
        },
      });
      return {
        data,
        message: 'Review updated sucsessfully',
        status: 'Success',
      };
    } catch (error) {
      throw new BadRequestException('User never post review on this film');
    }
  }

  async deleteReview(userId: string, filmId: string) {
    try {
      const data = await this.prisma.filmReview.delete({
        where: {
          userId_filmId: {
            userId,
            filmId,
          },
        },
      });
      return {
        data,
        message: 'Review deleted sucsessfully',
        status: 'Success',
      };
    } catch (error) {
      throw new BadRequestException('User never post review on this film');
    }
  }

  async updateReview(filmId: string) {
    try {
      const agg = await this.prisma.filmReview.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          filmId,
        },
      });
      const newRating = agg._avg.rating;
      await this.prisma.film.update({
        where: {
          id: filmId,
        },
        data: {
          rating: newRating ? newRating : 0,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Fail to update review');
    }
  }

  async deleteReviewBatch(userId: string, filmIds: string[]) {
    for (const filmId of filmIds) {
      await this.deleteReview(userId, filmId);
    }
  }

  async updateReviewBatch(filmIds: string[]) {
    for (const filmId of filmIds) {
      await this.updateReview(filmId);
    }
  }
}
