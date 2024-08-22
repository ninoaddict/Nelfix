import { Injectable, Req } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Request } from 'express';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  async signIn(username: string, password: string) {
    return this.authService.signIn(username, password);
  }

  async self(@Req() req: Request) {
    return this.userService.self(req);
  }
}
