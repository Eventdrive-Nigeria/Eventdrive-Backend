import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as randomstring from 'randomstring';
import { User } from './schemas';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterUserDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registration(registerUserDto: RegisterUserDto) {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        registerUserDto.password,
        saltOrRounds,
      );

      const user = await this.userModel.create({
        ...registerUserDto,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email or username already exists');
      }
      throw new HttpException('Registration Failed', HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userModel
        .findOne({ email: loginDto.email })
        .exec();

      if (!user) {
        throw new HttpException(
          'Invalid parameters, Try signing up',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.status === 'suspended') {
        throw new HttpException('Account suspended', HttpStatus.FORBIDDEN);
      }

      const passwordMatch = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
      }

      const token = this.jwtService.sign(
        {
          userId: user._id,
          name: user.userName,
        },
        { expiresIn: '7d' },
      );

      return { token };
    } catch (error) {
      if (error.message && error.status) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(
        'Registration failed! Check your parameters and try again',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    try {
      const { oldPassword, newPassword } = changePasswordDto;

      const user = await this.userModel.findById(userId).exec();

      if (!user) {
        throw new HttpException(
          'Invalid email, user not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const passwordMatch = await bcrypt.compare(oldPassword, user.password);

      if (!passwordMatch) {
        throw new HttpException('Invalid old password', HttpStatus.BAD_REQUEST);
      }

      const saltOrRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltOrRounds);
      user.password = hashedNewPassword;
      await user.save();

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      if (error.message && error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new HttpException(
        'Failed to change password, please try again',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.userModel
        .findOne({ email: forgotPasswordDto.email })
        .exec();

      if (!user) {
        throw new HttpException(
          'Invalid email. usernot found',
          HttpStatus.NOT_FOUND,
        );
      }

      const emailMatch = forgotPasswordDto.email === user.email;

      if (!emailMatch) {
        throw new HttpException('Invalid email', HttpStatus.NOT_FOUND);
      }

      const newPassword = randomstring.generate({
        length: 8,
        charset: 'alphanumeric',
      });

      const saltOrRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltOrRounds);

      user.password = hashedNewPassword;
      await user.save();

      return {
        message: 'Password reset successful',
        newPassword: newPassword,
      };
    } catch (error) {
      if (error.message && error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new HttpException(
        'Failed to reset password, please try again',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
