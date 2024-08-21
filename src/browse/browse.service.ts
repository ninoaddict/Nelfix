import { BadRequestException, Injectable } from '@nestjs/common';
import { FilmService } from 'src/film/film.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BrowseService {
  constructor(
    private filmService: FilmService,
    private userService: UsersService,
  ) {}

  async browse(payload, query: string, page: number, limit: number) {
    const data = await this.filmService.getAllFilms(query);
    const numOfData = data.length;
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

    const films = await this.filmService.getFilmsByCursor(page, limit, query);
    return {
      films,
      page,
      lowerPage,
      upperPage,
      maxPage,
      query,
      user: res,
    };
  }

  async detail(payload, filmId: string) {
    let isBought = false;
    let isWishList = false;
    let user = null;
    let res = null;
    const film = await this.filmService.getFilmById(filmId);

    if (payload) {
      const boughtData = await this.filmService.getFilmBought(
        filmId,
        payload.id,
      );
      if (boughtData) {
        isBought = true;
      }

      const wishListData = await this.filmService.getFilmInWishList(
        payload.id,
        filmId,
      );
      if (wishListData) {
        isWishList = true;
      }

      user = await this.userService.findOneById(payload.id);
      if (user) {
        res = {
          username: user.username,
          balance: user.balance,
          email: user.email,
        };
      }
    }

    return {
      isBought,
      isWishList,
      film,
      user: res,
    };
  }
}
