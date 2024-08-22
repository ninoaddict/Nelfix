import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AboutService {
  constructor(private userService: UsersService) {}

  async aboutUs(payload) {
    let user = null;
    if (payload) {
      user = await this.userService.findOneById(payload.id);
    }

    let res = null;
    if (user) {
      res = {
        username: user.username,
        balance: user.balance,
        email: user.email,
      };
    }

    return {
      user: res,
    };
  }
}
