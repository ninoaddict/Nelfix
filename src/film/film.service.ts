import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Film } from '@prisma/client';
import { S3 } from 'aws-sdk';
import { CreateFilmDto, CreateFilmRaw, UpdateFilmDto } from 'src/dto/film.dto';
import { PrismaService } from 'src/prisma/prisma.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cuid = require('cuid');

@Injectable()
export class FilmService {
  constructor(private prisma: PrismaService) {}

  private s3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_KEY_SECRET,
  });

  parseFilmData(filmRaw: CreateFilmRaw): CreateFilmDto {
    try {
      const parsedData = {
        title: filmRaw.title,
        description: filmRaw.description,
        director: filmRaw.director,
        release_year: parseInt(filmRaw.release_year),
        genre: filmRaw.genre,
        price: parseInt(filmRaw.price),
        duration: parseInt(filmRaw.duration),
      };
      return parsedData;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async uploadFilm(
    video: Express.Multer.File,
    cover_image: Express.Multer.File,
    filmDto: CreateFilmDto,
  ) {
    if (!video || !cover_image) {
      throw new BadRequestException();
    }
    const id = cuid();

    video.filename = id + '_video';
    const video_url = await this.uploadFile(video);

    cover_image.filename = id + '_cover_image';
    const cover_image_url = await this.uploadFile(cover_image);

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
    console.log(new_film);
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
        video.filename = filmDto.id + '_video';
        await this.uploadFile(video);
      }

      // update the cover image if not null
      if (cover_image) {
        cover_image.filename = filmDto.id + '_cover_image';
        await this.uploadFile(cover_image);
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
      const video = id + '_video';
      await this.deleteFile(video);

      // delete cover image
      const cover_image = id + '_cover_image';
      await this.deleteFile(cover_image);

      return data;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Film not found');
    }
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
      const { description, video_url, ...r } = f;
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

  async getFilmBought(filmId: string, userId: string) {
    return await this.prisma.userBoughtFilm.findFirst({
      where: {
        filmId,
        userId,
      },
    });
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

  async uploadFile(file: Express.Multer.File) {
    const res = await this.uploadS3Bucket(
      file.buffer,
      process.env.AWS_S3_BUCKET,
      file.filename ? file.filename : file.originalname,
      file.mimetype,
    );
    return res.Location;
  }

  async uploadS3Bucket(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };
    return this.s3.upload(params).promise();
  }

  async deleteFile(name: string) {
    const data = await this.deleteS3Bucket(process.env.AWS_S3_BUCKET, name);
    console.log(data);
  }

  async deleteS3Bucket(bucket: string, name: string) {
    const params = {
      Bucket: bucket,
      Key: name,
    };
    return this.s3.deleteObject(params).promise();
  }
}
