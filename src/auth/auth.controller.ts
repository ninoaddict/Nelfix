import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/dto/user.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { UserValidationPipe } from 'src/users/validation.pipe';
import { Role } from '@prisma/client';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  async signIn(@Body(new UserValidationPipe()) signInDto: LoginDto) {
    const data = await this.authService.signIn(
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
    return this.authService.self(req);
  }

  @Get('auth/login')
  getLogin(@Req() req: Request, @Res() res: Response) {
    this.authService.getAuthPage(req, res, 'login');
  }

  @Post('auth/login')
  @UseInterceptors(NoFilesInterceptor())
  async userSignIn(
    @Body(new UserValidationPipe()) signInDto: LoginDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    res.cookie('jwt-nelfix', data.token, {
      httpOnly: true,
      secure: false,
      expires: new Date((data.iat + 2592000) * 1000),
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

  @Get('auth/register')
  getRegister(@Req() req: Request, @Res() res: Response) {
    this.authService.getAuthPage(req, res, 'register');
  }

  @Post('auth/register')
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
      expires: new Date((data.iat + 2592000) * 1000),
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
