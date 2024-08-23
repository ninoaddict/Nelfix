import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { BrowseService } from './browse.service';
import { UserToken } from 'src/users/user.decorator';
import { UserTokenPayload } from 'src/dto/user.dto';

@Controller('browse')
export class BrowseController {
  constructor(private readonly browseService: BrowseService) {}

  @Get()
  @Render('home')
  async browse(
    @UserToken() user: UserTokenPayload | undefined,
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.browseService.browse(
      user,
      query ? query : '',
      page ? page : 1,
      limit ? limit : 12,
    );
  }

  @Get(':id')
  @Render('detail')
  async detail(
    @UserToken() user: UserTokenPayload | undefined,
    @Param('id') id: string,
  ) {
    return await this.browseService.detail(user, id);
  }
}
