import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';

@Module({
  imports: [AwsS3Module],
  providers: [FilmService],
  controllers: [FilmController],
  exports: [FilmService],
})
export class FilmModule {}
