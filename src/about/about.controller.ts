import { Controller, Get, Render } from '@nestjs/common';
import { AboutService } from './about.service';
import { UserToken } from 'src/users/user.decorator';
import { UserTokenPayload } from 'src/dto/user.dto';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @Render('about')
  async aboutUs(@UserToken() user: UserTokenPayload | undefined) {
    return await this.aboutService.aboutUs(user);
  }
}
