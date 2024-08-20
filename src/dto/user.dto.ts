import { Role } from '@prisma/client';
import { IsEmail, IsString, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[^@]+$/, {
    message: 'Username cannot be in the form of an email address.',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
