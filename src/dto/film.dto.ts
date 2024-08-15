export type CreateFilmRaw = {
  title: string;
  description: string;
  director: string;
  release_year: string;
  genre: string;
  price: string;
  duration: string;
};

export type CreateFilmDto = {
  title: string;
  description: string;
  director: string;
  release_year: number;
  genre: string[];
  price: number;
  duration: number;
};

export type UpdateFilmDto = {
  id: string;
  title: string;
  description: string;
  director: string;
  release_year: number;
  genre: string[];
  price: number;
  duration: number;
};
