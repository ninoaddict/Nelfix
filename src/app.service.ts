import { Injectable, Req } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(private authService: AuthService) {}

  async signIn(username: string, password: string) {
    return this.authService.signIn(username, password);
  }

  async self(@Req() req: Request) {
    return this.authService.self(req);
  }
}
