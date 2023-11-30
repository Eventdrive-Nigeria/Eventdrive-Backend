import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ForgetEmailDto } from './dto/forgetemail.dto';
import { ResetPasswordDTO } from './dto/resetpasword.dto';
import { confirmedVendorEmailDTO } from './dto/confirmedvendor.email.dto';

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService){}

    //vendor confirmed signup email address
    @Post()
    async confirmedVendorEmailToken(@Body() input: confirmedVendorEmailDTO){
       return this.emailService.confirmedVendorEmail(input)
    }

    //vendor forget password
  @Post('forgetvendorpassword')
  async vendorForgePassword(@Body() input: ForgetEmailDto){
    return await this.emailService.vendorForgetPassword(input)
  }

  @Post('resetpasssword')
  resetvendorpassword(@Body() input: ResetPasswordDTO){
     return  this.emailService.resetVendorPassword(input)
 }
}
