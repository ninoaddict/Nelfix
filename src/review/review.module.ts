import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FilmModule } from 'src/film/film.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [PrismaModule, FilmModule],
})
export class ReviewModule {}
