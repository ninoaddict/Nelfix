import { UserTokenPayload } from 'src/dto/user.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

export default function JwtService(_key: string) {
  const key = _key;

  function encodeBase64(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  function decodeBase64(str: string): string {
    const paddedStr = str.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(paddedStr, 'base64').toString('utf-8');
  }

  function stringify(obj: any): string {
    return JSON.stringify(obj);
  }

  function checkSumGen(head: string, body: string): string {
    const checkSumStr = head + '.' + body;
    const hash = crypto.createHmac('sha256', key);
    const checkSum = hash
      .update(checkSumStr)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return checkSum;
  }

  const alg = { alg: 'HS256', typ: 'JWT' };

  return {
    encode: (obj: any): string => {
      let result = '';
      const header = encodeBase64(stringify(alg));
      result += header + '.';
      const body = encodeBase64(stringify(obj));
      result += body + '.';
      const checkSum = checkSumGen(header, body);
      result += checkSum;

      return result;
    },
    decode: (str: string) => {
      const jwtArr = str.split('.');

      if (jwtArr.length !== 3) {
        throw new Error('Invalid token structure');
      }

      const head = jwtArr[0];
      const body = jwtArr[1];
      const hash = jwtArr[2];
      const checkSum = checkSumGen(head, body);

      if (hash === checkSum) {
        const res: UserTokenPayload = JSON.parse(decodeBase64(body));

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
    },
  };
}
