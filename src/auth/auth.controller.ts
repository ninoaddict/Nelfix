import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/user.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { UserValidationPipe } from 'src/users/validation.pipe';
import { Role } from '@prisma/client';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  async signIn(@Body(new UserValidationPipe()) signInDto: LoginDto) {
    return await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }

  @Get('self')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getSelf(@Req() req: Request) {
    return this.authService.self(req);
  }

  @Get('auth/login')
  getLogin() {
    return 'Hello World!';
  }
}
