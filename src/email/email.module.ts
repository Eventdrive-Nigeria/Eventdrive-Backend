import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vendor, vendorSchema } from 'src/vendor/model/vendor.schema';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vendor.name, schema: vendorSchema }]),
  ],
  controllers: [EmailController],
  providers: [EmailService, ConfigService]
})
export class EmailModule {}
