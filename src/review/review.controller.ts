import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Request } from 'express';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateReviewDto } from 'src/dto/review.dto';
import { UserTokenPayload } from 'src/dto/user.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':id')
  @UseInterceptors(NoFilesInterceptor())
  async postReview(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const user: UserTokenPayload | undefined = req['user'];
    if (!user) {
      throw new UnauthorizedException();
    }

    const res = await this.reviewService.postReview(
      user.id,
      id,
      createReviewDto.content,
      createReviewDto.rating,
    );
    await this.reviewService.updateReview(id);
    return res;
  }

  @Put(':id')
  @UseInterceptors(NoFilesInterceptor())
  async putReview(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const user: UserTokenPayload | undefined = req['user'];
    if (!user) {
      throw new UnauthorizedException();
    }

    const res = await this.reviewService.putReview(
      user.id,
      id,
      createReviewDto.content,
      createReviewDto.rating,
    );

    await this.reviewService.updateReview(id);
    return res;
  }

  @Delete(':id')
  async deleteReview(@Req() req: Request, @Param('id') id: string) {
    const user: UserTokenPayload | undefined = req['user'];
    if (!user) {
      throw new UnauthorizedException();
    }
    const res = await this.reviewService.deleteReview(user.id, id);
    await this.reviewService.updateReview(id);
    return res;
  }
}
