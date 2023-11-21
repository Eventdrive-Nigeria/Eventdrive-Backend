import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    // Initialize the JWT strategy with configuration options
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Validate function called when verifying the JWT token
  async validate(payload: any) {
    // Find the user in the database based on the user ID from the JWT payload
    const user = this.userModel.findById(payload.userId).exec();

    // If the user is not found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to access this end point',
      );
    }

    // Return the user object to be stored in the request object
    return user;
  }
}
