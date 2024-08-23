import { Controller, Get, Param, Res } from '@nestjs/common';
import { WatchService } from './watch.service';
import { Response } from 'express';
import { UserTokenPayload } from 'src/dto/user.dto';
import { UserToken } from 'src/users/user.decorator';

@Controller('watch')
export class WatchController {
  constructor(private readonly watchService: WatchService) {}

  @Get(':id')
  async getFilm(
    @UserToken() user: UserTokenPayload | undefined,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!user) {
      res.redirect('/auth/login');
      return;
    }
    const data = await this.watchService.getFilm(id, user.id);
    res.render('watch', data);
  }
}
