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
import JwtService from 'src/lib/jwt';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/dto/user.dto';
import { getCookie } from 'src/lib/cookie';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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

    const jwtService = JwtService(process.env.SECRET);

    return {
      username: user.username,
      token: jwtService.encode(payload),
      iat: payload.iat,
    };
  }

  getAuthPage(@Req() req: Request, @Res() res: Response, view: string) {
    try {
      const token = getCookie(req.headers.cookie, 'jwt-nelfix');
      if (token) {
        return res.redirect('/');
      }
      res.render(view);
    } catch (error) {
      res.render(view);
    }
  }

  self(request: Request) {
    const token = this.extractToken(request);
    return {
      status: 'success',
      message: 'Get self',
      data: {
        username: request['user']['username'],
        token,
      },
    };
  }

  extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
