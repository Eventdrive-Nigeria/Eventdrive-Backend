import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ForgetEmailDto } from './dto/forgetemail.dto';

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService){}

    //vendor forget password
  @Post()
  async vendorForgePassword(@Body() email: ForgetEmailDto){
    return await this.emailService.vendorForgetPassword(email)
  }
}
