import { Controller, Get, Query, Res } from '@nestjs/common';
import { MylistService } from './mylist.service';
import { Response } from 'express';
import { UserToken } from 'src/users/user.decorator';
import { UserTokenPayload } from 'src/dto/user.dto';

@Controller('mylist')
export class MylistController {
  constructor(private readonly myListService: MylistService) {}

  @Get()
  async getMyList(
    @UserToken() user: UserTokenPayload | undefined,
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    if (!user) {
      res.redirect('/auth/login');
      return;
    }

    const data = await this.myListService.getMyList(
      user.id,
      query ? query : '',
      page ? page : 1,
      limit ? limit : 12,
    );
    res.render('mylist', data);
  }
}
