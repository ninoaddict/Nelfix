import { Module } from '@nestjs/common';
import { WatchService } from './watch.service';
import { WatchController } from './watch.controller';
import { FilmModule } from 'src/film/film.module';

@Module({
  imports: [FilmModule],
  providers: [WatchService],
  controllers: [WatchController],
})
export class WatchModule {}
