import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [PrismaModule],
  exports: [ReviewService],
})
export class ReviewModule {}
