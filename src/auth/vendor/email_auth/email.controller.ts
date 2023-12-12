import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResetPasswordDTO } from './dto/resetpasword.dto';
import { confirmedVendorEmailDTO } from './dto/confirmedvendor.email.dto';
import { ForgetPasswordDto } from './dto/forgotpassword.dto';

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService){}

    //vendor confirmed signup email address
    @Post('confirmed')
  async confirmedVendorEmailToken(@Body() input: confirmedVendorEmailDTO):Promise<any>{
     
       return await this.emailService.confirmedVendorEmail(input)
    }

    //vendor forgot password
  @Post('forgotvendorpassword')
  async vendorForgePassword(@Body() body: ForgetPasswordDto){
    return await this.emailService.vendorForgetPassword(body)
  }

  @Post('resetpasssword')
  resetvendorpassword(@Body() input: ResetPasswordDTO){
     return  this.emailService.resetVendorPassword(input)
 }


}
