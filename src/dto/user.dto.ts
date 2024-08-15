import { Role } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  role: Role | null;
}

export type UserPayload = {
  id: string;
  username: string;
  email: string;
  balance: number;
};

export type UserTokenPayload = {
  id: string;
  username: string;
  role: Role;
  iat: number;
};

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
