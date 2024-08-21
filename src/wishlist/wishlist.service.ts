import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FilmService } from 'src/film/film.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishlistService {
  constructor(
    private filmService: FilmService,
    private userService: UsersService,
  ) {}

  async getWishList(
    userId: string,
    query: string,
    page: number,
    limit: number,
  ) {
    const numOfData = await this.filmService.getWishListNumber(userId, query);
    const maxPage = Math.max(1, Math.ceil(numOfData / limit));

    if (page > maxPage || page < 1) {
      throw new BadRequestException();
    }

    if (limit < 8 || limit > 50) {
      throw new BadRequestException();
    }

    let lowerPage = Math.max(1, page - 2);
    let upperPage = Math.min(maxPage, page + 2);

    if (page === 1 || page === 2) {
      upperPage = Math.min(maxPage, 5);
    } else if (page === maxPage) {
      lowerPage = Math.max(1, maxPage - 4);
    } else if (page === maxPage - 1) {
      lowerPage = Math.max(1, maxPage - 3);
    }

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const films = await this.filmService.getWishListByCursor(
      userId,
      page,
      limit,
      query,
    );
    return {
      films,
      page,
      lowerPage,
      upperPage,
      maxPage,
      query,
      user: {
        username: user.username,
        balance: user.balance,
        email: user.email,
      },
    };
  }
}
