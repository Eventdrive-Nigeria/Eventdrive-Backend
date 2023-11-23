import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor_Auth_Service } from '../vendor_auth/vendor.auth.service';
import * as dotenv from 'dotenv';
import { JwtPayload } from '../common/jwt.interface';
dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectModel(User.name)
  private userModel: Model<User>,
  private vendorService: Vendor_Auth_Service
  
  ) {
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
    const user = this.userModel.findById(payload.user).exec();

    const vendor = await this.vendorService.generatejwt(payload.user);
    console.log(vendor)

    // If the user is not found, throw an UnauthorizedException
    if (!user || !vendor) {
      throw new UnauthorizedException(
        'You are not authorized to access this end point',
      );
    }

    if (!vendor) {
      throw new UnauthorizedException(
        'You are not authorized to access this end point',
      );
    }

    // Return the user object to be stored in the request object
    return vendor || user;
  }
}
