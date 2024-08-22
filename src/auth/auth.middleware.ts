import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from 'src/jwt/jwt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly utilService: UtilService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.utilService.getCookie(
        req.headers.cookie,
        'jwt-nelfix',
      );
      if (!token) {
        next();
        return;
      }

      const payload = this.jwtService.decode(token);
      const userId = payload.id;

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (user && user.role === 'USER') {
        req['user'] = payload;
        next();
      } else {
        res.clearCookie('jwt-nelfix');
        next();
        return;
      }
    } catch (error) {
      next();
      return;
    }
  }
}
