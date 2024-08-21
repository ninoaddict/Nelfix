import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Request, Response } from 'express';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishListService: WishlistService) {}

  @Get()
  async getWishList(
    @Req() req: Request,
    @Res() res: Response,
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const user = req['user'];
    if (!user) {
      res.redirect('/auth/login');
      return;
    }

    const data = await this.wishListService.getWishList(
      user.id,
      query ? query : '',
      page ? page : 1,
      limit ? limit : 12,
    );
    res.render('wishlist', data);
  }
}
