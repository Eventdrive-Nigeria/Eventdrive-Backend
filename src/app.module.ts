import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './email/email.module';

@Module({
  imports: [AuthModule, MongooseModule.forRoot(process.env.MONGO_URI), EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
