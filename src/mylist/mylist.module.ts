import { Module } from '@nestjs/common';
import { MylistService } from './mylist.service';
import { MylistController } from './mylist.controller';
import { FilmModule } from 'src/film/film.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [FilmModule, UsersModule],
  providers: [MylistService],
  controllers: [MylistController],
})
export class MylistModule {}
