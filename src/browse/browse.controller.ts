import { Controller, Get, Query, Render } from '@nestjs/common';
import { BrowseService } from './browse.service';

@Controller('browse')
export class BrowseController {
  constructor(private readonly browseService: BrowseService) {}

  @Get()
  @Render('index')
  async browse(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.browseService.browse(
      query ? query : '',
      page ? page : 1,
      limit ? limit : 12,
    );
  }
}
