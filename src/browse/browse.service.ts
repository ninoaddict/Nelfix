import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { FilmService } from 'src/film/film.service';

@Injectable()
export class BrowseService {
  constructor(private filmService: FilmService) {}

  async browse(query: string, page: number, limit: number) {
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

    const films = await this.filmService.getFilmsByCursor(page, limit, query);
    return {
      films,
      page,
      lowerPage,
      upperPage,
      maxPage,
      query,
    };
  }

  async detail(req: Request, filmId: string) {
    let isBought = false;
    const film = await this.filmService.getFilmById(filmId);
    if (req['user']) {
      const boughtData = await this.filmService.getFilmBought(
        filmId,
        req['user'].id,
      );
      if (boughtData) {
        isBought = true;
      }
    }
    console.log(isBought);
    return {
      isBought,
      film,
    };
  }
}
