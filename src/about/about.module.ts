import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [AboutService],
  controllers: [AboutController],
  imports: [UsersModule],
})
export class AboutModule {}
