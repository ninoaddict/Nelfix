import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Film } from '@prisma/client';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { CreateFilmDto, UpdateFilmDto } from 'src/dto/film.dto';
import { PrismaService } from 'src/prisma/prisma.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cuid = require('cuid');

@Injectable()
export class FilmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async uploadFilm(
    video: Express.Multer.File | null,
    cover_image: Express.Multer.File | null,
    filmDto: CreateFilmDto,
  ) {
    if (!video) {
      throw new BadRequestException();
    }
    const id = cuid();

    video.filename = 'video/' + id;
    const video_url = await this.awsS3Service.uploadFile(video);

    let cover_image_url: string | null = null;
    if (cover_image) {
      cover_image.filename = 'cover_image/' + id;
      cover_image_url = await this.awsS3Service.uploadFile(cover_image);
    }

    const new_film = await this.prisma.film.create({
      data: {
        id,
        title: filmDto.title,
        description: filmDto.description,
        director: filmDto.director,
        release_year: filmDto.release_year,
        genre: filmDto.genre,
        price: filmDto.price,
        duration: filmDto.duration,
        video_url,
        cover_image_url,
      },
    });
    return new_film;
  }

  async updateFilm(
    video: Express.Multer.File,
    cover_image: Express.Multer.File,
    filmDto: UpdateFilmDto,
  ) {
    try {
      // update the film database
      const data = await this.prisma.film.update({
        where: {
          id: filmDto.id,
        },
        data: {
          title: filmDto.title,
          description: filmDto.description,
          director: filmDto.director,
          release_year: filmDto.release_year,
          genre: filmDto.genre,
          price: filmDto.price,
          duration: filmDto.duration,
        },
      });

      // update the video if not null
      if (video) {
        video.filename = 'video/' + filmDto.id;
        await this.awsS3Service.uploadFile(video);
      }

      // update the cover image if not null
      if (cover_image) {
        cover_image.filename = 'cover_image/' + filmDto.id;
        await this.awsS3Service.uploadFile(cover_image);
      }
      return data;
    } catch (error) {
      throw new NotFoundException('Film not found');
    }
  }

  async deleteFilm(id: string) {
    try {
      const data = await this.prisma.film.delete({
        where: { id },
      });
      // delete video
      const video = 'video/' + id;
      await this.awsS3Service.deleteFile(video);

      // delete cover image
      const cover_image = 'cover_image/' + id;
      await this.awsS3Service.deleteFile(cover_image);

      return data;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Film not found');
    }
  }

  async getAllFilmsNumber(query: string) {
    return await this.prisma.film.count({
      where: {
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
    });
  }

  async getAllFilms(query: string) {
    const data: Film[] = await this.prisma.film.findMany({
      where: {
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
    });
    const res = data.map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { rating, description, video_url, ...r } = f;
      return r;
    });
    return res;
  }

  async getFilmsByCursor(cursor: number, limit: number, query: string) {
    const data: Film[] = await this.prisma.film.findMany({
      where: {
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
      skip: limit * (cursor - 1),
      take: limit,
    });
    const res = data.map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { description, video_url, ...r } = f;
      return r;
    });
    return res;
  }

  async getBoughtFilmsNumber(userId: string, query: string) {
    return await this.prisma.userBoughtFilm.count({
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

  async getBoughtFilms(userId: string, query: string) {
    const userWithFilms = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        userBoughtFilm: {
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

    const films = userWithFilms?.userBoughtFilm.map(
      (relation) => relation.film,
    );
    return films;
  }

  async getBoughtFilmsByCursor(
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
        userBoughtFilm: {
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

    const films = userWithFilms?.userBoughtFilm.map(
      (relation) => relation.film,
    );
    return films;
  }

  async getFilmBought(filmId: string, userId: string) {
    return await this.prisma.userBoughtFilm.findFirst({
      where: {
        filmId,
        userId,
      },
    });
  }

  async getFilmById(id: string) {
    const film = await this.prisma.film.findUnique({
      where: {
        id,
      },
    });
    if (film) {
      return film;
    } else {
      throw new NotFoundException('Film not found');
    }
  }

  async buyFilm(filmId: string, userId: string) {
    const film = await this.getFilmById(filmId);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user.balance < film.price) {
      throw new ForbiddenException('Insufficient balance on payment');
    }
    try {
      // deduct balance from user
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          balance: user.balance - film.price,
        },
      });

      // insert userBoughtFilm
      const data = await this.prisma.userBoughtFilm.create({
        data: {
          filmId,
          userId,
          price: film.price,
        },
      });
      return {
        message: 'Film bought successfully',
        status: 'success',
        data,
      };
    } catch (error) {
      throw new ConflictException('Film has been bought');
    }
  }
}
