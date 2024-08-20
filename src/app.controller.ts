import {
  Get,
  Controller,
  Req,
  Res,
  UseInterceptors,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { UserValidationPipe } from './users/validation.pipe';
import { LoginDto } from './dto/user.dto';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from '@prisma/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Req() req: Request, @Res() res: Response) {
    res.redirect('/browse');
  }

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  async signIn(@Body(new UserValidationPipe()) signInDto: LoginDto) {
    const data = await this.appService.signIn(
      signInDto.username,
      signInDto.password,
    );
    return {
      status: 'success',
      message: 'Sucessfully login',
      data: {
        username: data.username,
        token: data.token,
      },
    };
  }

  @Get('self')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getSelf(@Req() req: Request) {
    return this.appService.self(req);
  }
}
