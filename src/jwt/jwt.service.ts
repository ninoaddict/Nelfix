/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { UserTokenPayload } from 'src/dto/user.dto';
const crypto = require('crypto');

@Injectable()
export class JwtService {
  private key = process.env.SECRET;
  private alg = { alg: 'HS256', typ: 'JWT' };

  private encodeBase64(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private decodeBase64(str: string): string {
    const paddedStr = str.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(paddedStr, 'base64').toString('utf-8');
  }

  private stringify(obj: any): string {
    return JSON.stringify(obj);
  }

  private checkSumGen(head: string, body: string): string {
    const checkSumStr = head + '.' + body;
    const hash = crypto.createHmac('sha256', this.key);
    const checkSum = hash
      .update(checkSumStr)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return checkSum;
  }

  public encode(obj: any): string {
    let result = '';
    const header = this.encodeBase64(this.stringify(this.alg));
    result += header + '.';
    const body = this.encodeBase64(this.stringify(obj));
    result += body + '.';
    const checkSum = this.checkSumGen(header, body);
    result += checkSum;

    return result;
  }

  public decode(str: string) {
    const jwtArr = str.split('.');

    if (jwtArr.length !== 3) {
      throw new Error('Invalid token structure');
    }

    const head = jwtArr[0];
    const body = jwtArr[1];
    const hash = jwtArr[2];
    const checkSum = this.checkSumGen(head, body);

    if (hash === checkSum) {
      const res: UserTokenPayload = JSON.parse(this.decodeBase64(body));

      const currTime = Math.floor(Date.now() / 1000);

      if (currTime < res.iat) {
        throw new Error('Token issued in the future');
      }

      if (currTime > res.iat + 2592000) {
        throw new Error('Token expired');
      }

      return res;
    } else {
      throw new Error('Token signature verification failed');
    }
  }
}
