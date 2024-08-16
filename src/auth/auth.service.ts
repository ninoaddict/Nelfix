import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import JwtService from 'src/lib/jwt';
import { compare } from 'bcrypt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(username: string, password: string) {
    const user: User | null = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException();
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException();
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
