import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilmService } from './film.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateFilmRaw } from 'src/dto/film.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('film')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover_image', maxCount: 1 },
    ]),
  )
  async uploadFilm(
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      cover_image?: Express.Multer.File[];
    },
    @Body() filmDto: CreateFilmRaw,
  ) {
    const filmData = this.filmService.parseFilmData(filmDto);
    const data = await this.filmService.uploadFilm(
      files.video ? files.video[0] : null,
      files.cover_image ? files.cover_image[0] : null,
      filmData,
    );
    return {
      status: 'success',
      message: 'Film uploaded successfully',
      data,
    };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllFilms(@Query('q') query: string) {
    const data = await this.filmService.getAllFilms(query ? query : '');
    return {
      status: 'success',
      message: 'Get all films',
      data,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getFilmById(@Param('id') id: string) {
    const data = await this.filmService.getFilmById(id);
    return {
      status: 'success',
      message: 'Get film by id',
      data,
    };
  }
}
