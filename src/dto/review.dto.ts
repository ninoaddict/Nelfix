import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Transform(({ value }) => {
    return value ? Number(value) : '';
  })
  @IsNotEmpty()
  @Max(5)
  @Min(1)
  rating: number;
}
