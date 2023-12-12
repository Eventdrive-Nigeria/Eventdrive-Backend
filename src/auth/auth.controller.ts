import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterUserDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/getuser.decorator';
import { VendorService } from './vendor/vendor.service';
import { EmailService } from './vendor/email_auth/email.service';
import { CreateVendor } from './vendor/dto/cretateVendor.dto';
import { LoginVendorDto } from './vendor/dto/login.dto';
import { VendorChangedPasswordDto } from './vendor/email_auth/dto/changepassword.dto';
import { Vendor } from './vendor/model/vendor.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private vendorAuthService: VendorService,
    private emailService: EmailService
    
    ) {}

  // Endpoint for user registration
  @Post('registeration')
  registeration(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registration(registerUserDto);
  }

  // Endpoint for user login, protected by JWT authentication
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Endpoint for changing user password, protected by JWT authentication
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Post('changepassword')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser('_id') userId: string,
  ) {
    return this.authService.changePassword(changePasswordDto, userId);
  }

  // Endpoint for handling forgot password requests
  @HttpCode(HttpStatus.OK)
  @Post('forgotPassword')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
  
  @Post('createvendor')
  async registervendor(@Body() input: CreateVendor){
    const vendor= await this.vendorAuthService.registerVendor(input)
    await this.emailService.sendVendorConfirmation(vendor)
    return vendor
  }

  @Post('loginvendor')
  async loginvendor(@Body() input: LoginVendorDto){
    return await this.vendorAuthService.loginvendor(input)
  }

  @Get('vendorprofile')
  @UseGuards(AuthGuard('jwt'))
  async currentloginVendorProfile(@GetUser() vendor){
    return vendor
    
  }

  @Post('vendorchangedpassword/:id')
  @UseGuards(AuthGuard('jwt'))
  vendorchangepassword(@Param('id') id: string, input: VendorChangedPasswordDto){
   
    return this.vendorAuthService.vendorchangepassword(id, input)
  }
 
}
