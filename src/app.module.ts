import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantsModule } from './plants/plants.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PlantsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
