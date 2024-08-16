import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import JwtService from 'src/lib/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const cookies = this.parseCookies(req.headers.cookie);
      const token = cookies['jwt-nelfix'];
      if (!token) {
        return res.redirect('/auth/login');
      }
      const jwtService = JwtService(process.env.SECRET);

      const payload = jwtService.decode(token);
      req['user'] = payload;
      next();
    } catch (error) {
      return res.redirect('/auth/login');
    }
  }

  parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie) => {
      const [name, value] = cookie.split('=').map((c) => c.trim());
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });

    return cookies;
  }
}
