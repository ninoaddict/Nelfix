import { Module } from '@nestjs/common';
import { BrowseController } from './browse.controller';
import { BrowseService } from './browse.service';
import { FilmModule } from 'src/film/film.module';

@Module({
  imports: [FilmModule],
  controllers: [BrowseController],
  providers: [BrowseService],
})
export class BrowseModule {}
