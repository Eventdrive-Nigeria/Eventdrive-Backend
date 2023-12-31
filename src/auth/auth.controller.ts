import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { Vendor_Auth_Service } from './vendor_auth/vendor.auth.service';
import { CreateVendor } from './vendor_auth/dto/cretateVendor.dto';
import { LoginVendorDto } from './vendor_auth/dto/login.dto';
import { Vendor } from './vendor_auth/model/vendor.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private vendorAuthService: Vendor_Auth_Service
    
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
    return await this.vendorAuthService.registerVendor(input)
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
}
