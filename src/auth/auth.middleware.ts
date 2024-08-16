import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import JwtService from 'src/lib/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      return res.redirect('/auth/login');
    }

    try {
      const jwtService = JwtService(process.env.SECRET);

      const payload = jwtService.decode(token);
      req['user'] = payload;
      next();
    } catch (error) {
      return res.redirect('auth/login');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
