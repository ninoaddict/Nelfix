import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import { BrowseService } from './browse.service';
import { Request } from 'express';

@Controller('browse')
export class BrowseController {
  constructor(private readonly browseService: BrowseService) {}

  @Get()
  @Render('home')
  async browse(
    @Req() req: Request,
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.browseService.browse(
      req['user'],
      query ? query : '',
      page ? page : 1,
      limit ? limit : 12,
    );
  }

  @Get(':id')
  @Render('detail')
  async detail(@Req() req: Request, @Param('id') id: string) {
    return await this.browseService.detail(req['user'], id);
  }
}
