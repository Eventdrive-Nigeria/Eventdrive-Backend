import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PlannerModule } from './planner/planner.module';

@Module({
  imports: [AuthModule, MongooseModule.forRoot(process.env.MONGO_URI), UserModule, PlannerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
