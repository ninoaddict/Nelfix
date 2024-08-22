import { BadRequestException, Injectable } from '@nestjs/common';
import { FilmService } from 'src/film/film.service';
import { ReviewService } from 'src/review/review.service';
import { UsersService } from 'src/users/users.service';
import { WishlistService } from 'src/wishlist/wishlist.service';

@Injectable()
export class BrowseService {
  constructor(
    private readonly filmService: FilmService,
    private readonly userService: UsersService,
    private readonly reviewService: ReviewService,
    private readonly wishListService: WishlistService,
  ) {}

  async browse(payload, query: string, page: number, limit: number) {
    const numOfData = await this.filmService.getAllFilmsNumber(query);
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
    let currReview = null;
    const film = await this.filmService.getFilmById(filmId);
    const reviews = await this.reviewService.getReview(filmId);

    if (payload) {
      const boughtData = await this.filmService.getFilmBought(
        filmId,
        payload.id,
      );
      if (boughtData) {
        isBought = true;
      }

      const wishListData = await this.wishListService.getFilmInWishList(
        payload.id,
        filmId,
      );
      if (wishListData) {
        isWishList = true;
      }

      currReview = await this.reviewService.getReviewPair(payload.id, filmId);

      user = await this.userService.findOneById(payload.id);
      if (user) {
        res = {
          id: user.id,
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
      reviews,
      currReview,
    };
  }
}
