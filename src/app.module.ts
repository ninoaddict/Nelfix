import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilmModule } from './film/film.module';
import { BrowseModule } from './browse/browse.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { BrowseController } from './browse/browse.controller';
import { WatchModule } from './watch/watch.module';
import { WatchController } from './watch/watch.controller';
import { MylistModule } from './mylist/mylist.module';
import { MylistController } from './mylist/mylist.controller';
import { WishlistModule } from './wishlist/wishlist.module';
import { WishlistController } from './wishlist/wishlist.controller';
import { ReviewModule } from './review/review.module';
import { ReviewController } from './review/review.controller';
import { JwtModule } from './jwt/jwt.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    FilmModule,
    BrowseModule,
    WatchModule,
    MylistModule,
    WishlistModule,
    ReviewModule,
    JwtModule,
    AwsS3Module,
    UtilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      WatchController,
      BrowseController,
      MylistController,
      WishlistController,
      ReviewController,
      {
        path: 'films/buy/:id',
        method: RequestMethod.POST,
      },
      {
        path: 'films/wishlist/:id',
        method: RequestMethod.ALL,
      },
    );
  }
}
