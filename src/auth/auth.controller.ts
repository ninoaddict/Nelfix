import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/user.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { UserValidationPipe } from 'src/users/validation.pipe';

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
}
