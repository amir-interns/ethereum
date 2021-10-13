import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProdController } from './prod/prod.controller';

@Module({
  imports: [],
  controllers: [AppController, ProdController],
  providers: [AppService],
})
export class AppModule {}
