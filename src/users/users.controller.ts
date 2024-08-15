import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role, User } from '@prisma/client';
import { CreateUserDto, UserPayload } from 'src/dto/user.dto';
import { UserValidationPipe } from './validation.pipe';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    const users: User[] = await this.usersService.findAllUser();
    const data: UserPayload[] = users.map((data: UserPayload) => {
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        balance: data.balance,
      };
    });
    return {
      status: 'success',
      message: 'Get all users',
      data,
    };
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body(new UserValidationPipe()) createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    const user: User = await this.usersService.findOne(id);
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    };
    return {
      status: 'success',
      message: 'Get user by ID',
      data,
    };
  }
}
