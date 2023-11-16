import {
  Body,
  Controller,
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registeration')
  registeration(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registration(registerUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Post('changepassword')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser('_id') userId: string,
  ) {
    return this.authService.changePassword(changePasswordDto, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgotPassword')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
