import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Injectable()
export class UserAuthGuard extends AuthGuard(['jwt']) {
  // Constructor to initialize the UserAuthGuard with the JwtStrategy
  constructor(private readonly jwtStrategy: JwtStrategy) {
    // Call the constructor of the parent class (AuthGuard) with the JwtStrategy
    super([jwtStrategy]);
  }

  // Override the canActivate method to execute the authentication logic
  canActivate(context: ExecutionContext) {
    // Call the canActivate method of the parent class
    return super.canActivate(context);
  }

  // Override the handleRequest method to customize the response on authentication success or failure
  handleRequest(error, user) {
    // If there is an error or no user, throw an UnauthorizedException
    if (error || !user) {
      throw error || new UnauthorizedException();
    }

    // If authentication is successful, return the user
    return user;
  }
}
