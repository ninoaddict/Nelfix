import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Request, Response } from 'express';
import { RolesGuard } from 'src/roles/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/roles/roles.decorator';

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

    const data = await this.wishListService.getWishListPage(
      user.id,
      query ? query : '',
      page ? page : 1,
      limit ? limit : 12,
    );
    res.render('wishlist', data);
  }

  @Post(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async addToWishList(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    return await this.wishListService.createWishList(user.id, id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async removeFromWishList(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    return await this.wishListService.removeWishList(user.id, id);
  }
}
