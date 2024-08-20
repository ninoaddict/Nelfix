import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { WatchService } from './watch.service';
import { Request, Response } from 'express';

@Controller('watch')
export class WatchController {
  constructor(private readonly watchService: WatchService) {}

  @Get(':id')
  async getFilm(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const user = req['user'];
    if (!user) {
      res.redirect('/auth/login');
      return;
    }
    const data = await this.watchService.getFilm(id, user.id);
    res.render('watch', data);
  }
}
