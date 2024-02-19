import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { CatIdController } from './cat-id/cat-id.controller';

@Module({
  imports: [CatsModule],
  controllers: [ CatIdController, AppController],
  providers: [AppService],
})
export class AppModule {}
