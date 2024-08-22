import {
  ConflictException,
  Injectable,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/dto/user.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly utilService: UtilService,
  ) {}

  getAuthPage(@Req() req: Request, @Res() res: Response, view: string) {
    try {
      const token = this.utilService.getCookie(
        req.headers.cookie,
        'jwt-nelfix',
      );
      if (token) {
        return res.redirect('/');
      }
      res.render(view);
    } catch (error) {
      res.render(view);
    }
  }

  async register(registerDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(registerDto);
      return user;
    } catch (error) {
      throw new ConflictException('Email or username already exists');
    }
  }

  async signIn(username: string, password: string) {
    const user: User | null = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Password does not match');
    }
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
    };

    return {
      username: user.username,
      token: this.jwtService.encode(payload),
      payload,
    };
  }
}
