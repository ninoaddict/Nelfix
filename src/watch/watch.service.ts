import { ForbiddenException, Injectable } from '@nestjs/common';
import { FilmService } from 'src/film/film.service';

@Injectable()
export class WatchService {
  constructor(private readonly filmService: FilmService) {}

  async getFilm(filmId: string, userId: string) {
    const data = await this.filmService.getFilmBought(filmId, userId);
    if (!data) {
      throw new ForbiddenException('You have yet to purchase this film');
    }

    const film = await this.filmService.getFilmById(filmId);
    return {
      title: film.title,
      cover_image_url: film.cover_image_url,
      video_url: film.video_url,
    };
  }
}
