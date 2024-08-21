import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { FilmModule } from 'src/film/film.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [FilmModule, UsersModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
