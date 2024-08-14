import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(_username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        username: _username,
      },
    });
  }

  async findAll(): Promise<User[] | null> {
    return this.prisma.user.findMany();
  }

  async create(userDto: CreateUserDto): Promise<User | null> {
    const hashed = await hash(userDto.password, 10);

    return await this.prisma.user.create({
      data: {
        username: userDto.username,
        name: userDto.name,
        email: userDto.email,
        password: hashed,
        role: userDto.role ? userDto.role : "USER"
      },
    });
  }
}
