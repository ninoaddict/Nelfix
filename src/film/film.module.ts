import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';

@Module({
  providers: [FilmService],
  controllers: [FilmController],
})
export class FilmModule {}
