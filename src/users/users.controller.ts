import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role, User } from '@prisma/client';
import { UserPayload } from 'src/dto/user.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    const user: User = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
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

  @Post(':id/balance')
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async increaseBalance(
    @Param('id') id: string,
    @Body('increment', ParseIntPipe) increment: number,
  ) {
    const user = await this.usersService.increaseBalance(id, increment);
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    };
    return {
      status: 'success',
      message: 'Update balance',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.deleteUser(id);
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    };
    return {
      status: 'success',
      message: 'Update balance',
      data,
    };
  }
}
