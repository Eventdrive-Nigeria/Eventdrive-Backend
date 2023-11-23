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

  // User registration function
  async registration(registerUserDto: RegisterUserDto) {
    try {
      // Hash the user's password before storing it in the database
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        registerUserDto.password,
        saltOrRounds,
      );

      // Create a new user with the hashed password
      const user = await this.userModel.create({
        ...registerUserDto,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      // Handle registration errors, such as duplicate email or username
      if (error.code === 11000) {
        throw new BadRequestException('Email or username already exists');
      }
      throw new HttpException('Registration Failed', HttpStatus.BAD_REQUEST);
    }
  }

  // User login function
  async login(loginDto: LoginDto) {
    try {
      // Find the user by email in the database
      const user = await this.userModel
        .findOne({ email: loginDto.email })
        .exec();

      // Check if the user exists
      if (!user) {
        throw new HttpException(
          'Invalid parameters, Try signing up',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the user account is suspended
      if (user.status === 'suspended') {
        throw new HttpException('Account suspended', HttpStatus.FORBIDDEN);
      }

      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      // If the password does not match, throw an error
      if (!passwordMatch) {
        throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
      }

      // Generate a JWT token for the user
      const token = this.jwtService.sign(
        {
          userId: user._id,
          name: user.userName,
        },
       { expiresIn: '7d' },
      );

      return { token };
      
    } catch (error) {
      // Handle login errors
      if (error.message && error.status) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(
        'Registration failed! Check your parameters and try again',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Function to change user password
  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    try {
      const { oldPassword, newPassword } = changePasswordDto;

      // Find the user by ID in the database
      const user = await this.userModel.findById(userId).exec();

      // If the user is not found, throw an error
      if (!user) {
        throw new HttpException(
          'Invalid email, user not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Compare the old password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);

      // If the old password does not match, throw an error
      if (!passwordMatch) {
        throw new HttpException('Invalid old password', HttpStatus.BAD_REQUEST);
      }

      // Hash the new password and update it in the database
      const saltOrRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltOrRounds);
      user.password = hashedNewPassword;
      await user.save();

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      // Handle change password errors
      if (error.message && error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new HttpException(
        'Failed to change password, please try again',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Function to handle password reset
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      // Find the user by email in the database
      const user = await this.userModel
        .findOne({ email: forgotPasswordDto.email })
        .exec();

      // If the user is not found, throw an error
      if (!user) {
        throw new HttpException(
          'Invalid email. usernot found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Check if the provided email matches the user's email
      const emailMatch = forgotPasswordDto.email === user.email;

      // If the email does not match, throw an error
      if (!emailMatch) {
        throw new HttpException('Invalid email', HttpStatus.NOT_FOUND);
      }

      // Generate a new random password
      const newPassword = randomstring.generate({
        length: 8,
        charset: 'alphanumeric',
      });

      // Hash the new password and update it in the database
      const saltOrRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltOrRounds);

      user.password = hashedNewPassword;
      await user.save();

      return {
        message: 'Password reset successful',
        newPassword: newPassword,
      };
    } catch (error) {
      // Handle password reset errors
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
