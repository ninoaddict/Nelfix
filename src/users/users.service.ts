import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { hash } from 'bcrypt';
import { ReviewService } from 'src/review/review.service';
import { UtilService } from 'src/util/util.service';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewService: ReviewService,
    private readonly utilService: UtilService,
  ) {}

  async findOne(usernameOrEmail: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: usernameOrEmail,
          },
          {
            email: usernameOrEmail,
          },
        ],
      },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
        role: Role.USER,
      },
    });
  }

  async findAll(): Promise<User[] | null> {
    return this.prisma.user.findMany();
  }

  async findAllUser(): Promise<User[] | null> {
    return this.prisma.user.findMany({
      where: {
        role: Role.USER,
      },
    });
  }

  self(request: Request) {
    const token = this.utilService.extractToken(request);
    return {
      status: 'success',
      message: 'Get self',
      data: {
        username: request['user']['username'],
        token,
      },
    };
  }

  async increaseBalance(id: string, balance: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
        role: Role.USER,
      },
      data: {
        balance: balance + user.balance,
      },
    });
    return updatedUser;
  }

  async deleteUser(id: string) {
    try {
      const filmdIds = await this.reviewService.getReviewFilmsIds(id);

      const user = await this.prisma.user.delete({
        where: {
          id: id,
          role: Role.USER,
        },
      });

      await this.reviewService.updateReviewBatch(filmdIds);
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async create(userDto: CreateUserDto): Promise<User | null> {
    const hashed = await hash(userDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: userDto.username,
        email: userDto.email,
        password: hashed,
        role: userDto.role ? userDto.role : 'USER',
      },
    });

    if (user && user.role === 'USER') {
      await this.prisma.profile.create({
        data: {
          userId: user.id,
          first_name: userDto.first_name,
          last_name: userDto.last_name,
        },
      });
    }

    return user;
  }
}
