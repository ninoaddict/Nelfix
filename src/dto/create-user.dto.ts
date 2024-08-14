import { Role } from '@prisma/client';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

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
  id: string,
  username: string,
  email: string,
  balance: number
}