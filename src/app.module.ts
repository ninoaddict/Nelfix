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

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    FilmModule,
    BrowseModule,
    WatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(WatchController, BrowseController, {
        path: 'films/:id/buy',
        method: RequestMethod.POST,
      });
  }
}
