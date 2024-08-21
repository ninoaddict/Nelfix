import { Module } from '@nestjs/common';
import { BrowseController } from './browse.controller';
import { BrowseService } from './browse.service';
import { FilmModule } from 'src/film/film.module';
import { UsersModule } from 'src/users/users.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [FilmModule, UsersModule, ReviewModule],
  controllers: [BrowseController],
  providers: [BrowseService],
})
export class BrowseModule {}
