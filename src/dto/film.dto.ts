import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFilmDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsInt()
  @Transform(({ value }) => {
    return value ? Number(value) : '';
  })
  @IsNotEmpty()
  release_year: number;

  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @IsInt()
  @Transform(({ value }) => {
    return value ? Number(value) : '';
  })
  @IsNotEmpty()
  price: number;

  @IsInt()
  @Transform(({ value }) => {
    return value ? Number(value) : '';
  })
  @IsNotEmpty()
  duration: number;
}

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
