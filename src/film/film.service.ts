import { BadRequestException, Injectable } from '@nestjs/common';
import { Film } from '@prisma/client';
import { S3 } from 'aws-sdk';
import { CreateFilmDto, CreateFilmRaw } from 'src/dto/film.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilmService {
  constructor(private prisma: PrismaService) {}

  private s3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_KEY_SECRET,
  });

  parseFilmData(filmRaw: CreateFilmRaw): CreateFilmDto {
    const parsedData = {
      title: filmRaw.title,
      description: filmRaw.description,
      director: filmRaw.director,
      release_year: parseInt(filmRaw.release_year),
      genre: JSON.parse(filmRaw.genre),
      price: parseInt(filmRaw.price),
      duration: parseInt(filmRaw.duration),
    };
    return parsedData;
  }

  async uploadFilm(
    video: Express.Multer.File,
    cover_image: Express.Multer.File,
    filmDto: CreateFilmDto,
  ) {
    if (!video) {
      throw new BadRequestException();
    }

    const video_url = await this.uploadFile(video);
    const cover_image_url = await this.uploadFile(cover_image);
    const new_film = await this.prisma.film.create({
      data: {
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

  async getFilmById(id: string) {
    return await this.prisma.film.findFirst({
      where: {
        id: id,
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const res = await this.uploadS3Bucket(
      file.buffer,
      process.env.AWS_S3_BUCKET,
      file.originalname,
      file.mimetype,
    );
    console.log(res.Location);
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
    console.log(params);
    try {
      const res = await this.s3.upload(params).promise();
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}
