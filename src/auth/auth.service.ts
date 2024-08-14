import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import JwtService from 'src/lib/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}

  async signIn(username: string, password: string): Promise<{ token: string }> {
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
      token: jwtService.encode(payload),
    };
  }
}
