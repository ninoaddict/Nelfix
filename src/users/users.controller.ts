import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto, UserPayload } from 'src/dto/create-user.dto';
import { UserValidationPipe } from './validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    const users: User[] = await this.usersService.findAll();
    const usersPayload: UserPayload[] = users.map((data: UserPayload) => {
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        balance: data.balance,
      };
    });
    return usersPayload;
  }

  @Post()
  async create(@Body(new UserValidationPipe()) createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user: User = await this.usersService.findOne(id);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    };
  }
}
