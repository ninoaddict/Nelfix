import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/dto/user.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { UserValidationPipe } from 'src/users/validation.pipe';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  getLogin(@Req() req: Request, @Res() res: Response) {
    this.authService.getAuthPage(req, res, 'login');
  }

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  async userSignIn(
    @Body(new UserValidationPipe()) signInDto: LoginDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    if (data.payload.role === 'USER') {
      res.cookie('jwt-nelfix', data.token, {
        httpOnly: true,
        secure: false,
        expires: new Date((data.payload.iat + 2592000) * 1000),
      });

      res.json({
        status: 'success',
        message: 'Sucessfully login',
        data: {
          username: data.username,
          token: data.token,
        },
      });
    } else {
      throw new UnauthorizedException('Please login as a user');
    }
  }

  @Get('register')
  getRegister(@Req() req: Request, @Res() res: Response) {
    this.authService.getAuthPage(req, res, 'register');
  }

  @Post('register')
  @UseInterceptors(NoFilesInterceptor())
  async userRegister(
    @Body(new UserValidationPipe()) registerDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.register(registerDto);
    if (!user) {
      throw new ConflictException('Email or username already exists');
    }

    const data = await this.authService.signIn(
      registerDto.username,
      registerDto.password,
    );

    res.cookie('jwt-nelfix', data.token, {
      httpOnly: true,
      secure: false,
      expires: new Date((data.payload.iat + 2592000) * 1000),
    });

    res.json({
      status: 'success',
      message: 'Sucessfully login',
      data: {
        username: data.username,
        token: data.token,
      },
    });
  }

  @Post('auth/logout')
  async userLogout(@Res() res: Response) {
    res.clearCookie('jwt-nelfix');
    res.send({
      status: 'success',
      message: 'Log out success',
    });
  }
}
