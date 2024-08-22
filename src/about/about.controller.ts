import { Controller, Get, Render, Req } from '@nestjs/common';
import { AboutService } from './about.service';
import { Request } from 'express';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @Render('about')
  async aboutUs(@Req() req: Request) {
    return await this.aboutService.aboutUs(req['user']);
  }
}
