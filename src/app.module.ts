import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilmModule } from './film/film.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, FilmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
