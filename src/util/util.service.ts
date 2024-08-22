import { Injectable } from '@nestjs/common';

import { Request } from 'express';

@Injectable()
export class UtilService {
  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie) => {
      const [name, value] = cookie.split('=').map((c) => c.trim());
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });

    return cookies;
  }

  getCookie(header: string, key: string): string {
    if (!header) {
      return header;
    }
    const parsedCookie = this.parseCookies(header);
    return parsedCookie[key];
  }

  extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
