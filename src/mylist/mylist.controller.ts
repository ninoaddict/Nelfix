import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { MylistService } from './mylist.service';
import { Request, Response } from 'express';

@Controller('mylist')
export class MylistController {
  constructor(private readonly myListService: MylistService) {}

  @Get()
  async getMyList(
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

    const data = await this.myListService.getMyList(
      user.id,
      query ? query : '',
      page ? page : 1,
      limit ? limit : 12,
    );
    console.log(data);
    res.render('mylist', data);
  }
}
