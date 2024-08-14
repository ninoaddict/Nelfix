import { Role } from '@prisma/client';

const crypto = require('crypto');

export default function JwtService(_key: string) {
  const key = _key;

  function encodeBase64(str: string): string {
    return Buffer.from(str).toString('base64').toString();
  }

  function decodeBase64(str: string): string {
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  function stringify(obj: any): string {
    return JSON.stringify(obj);
  }

  function checkSumGen(head: string, body: string): string {
    const checkSumStr = head + '.' + body;
    const hash = crypto.createHmac('sha256', key);
    const checkSum = hash.update(checkSumStr).digest('base64').toString();
    return checkSum;
  }

  const alg = { alg: 'HS256', typ: 'JWT' };

  return {
    encode: (obj: any): string => {
      let result = '';
      const header = encodeBase64(stringify(alg));
      // console.log(header);
      result += header + '.';
      const body = encodeBase64(stringify(obj));
      // console.log(body);
      result += body + '.';

      const checkSum = checkSumGen(header, body);
      result += checkSum;
      console.log(result);
      return result;
    },
    decode: (str: string) => {
      const jwtArr = str.split('.');
      const head = jwtArr[0];
      const body = jwtArr[1];
      const hash = jwtArr[2];
      const checkSum = checkSumGen(head, body);

      if (hash === checkSum) {
        console.log('jwt hash: ' + hash);
        console.log('gen hash: ' + checkSum);
        console.log('JWT was authenticated');

        const res: {
          id: string;
          username: string;
          role: Role;
          iat: number;
        } = JSON.parse(decodeBase64(body));

        const currTime = Math.floor(Date.now() / 1000);
        if (currTime > res.iat + 2592000) {
          throw 'Token expired';
        }

        return res;
      } else {
        throw 'Failed to decode';
      }
    },
  };
}
