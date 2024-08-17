import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import JwtService from 'src/lib/jwt';
import { getCookie } from 'src/lib/cookie';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = getCookie(req.headers.cookie, 'jwt-nelfix');
      if (!token) {
        return res.redirect('/auth/login');
      }
      const jwtService = JwtService(process.env.SECRET);

      const payload = jwtService.decode(token);
      const userId = payload.id;

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (user) {
        req['user'] = payload;
        next();
      } else {
        res.clearCookie('jwt-nelfix');
        return res.redirect('/auth/login');
      }
    } catch (error) {
      return res.redirect('/auth/login');
    }
  }
}
