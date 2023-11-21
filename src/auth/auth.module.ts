import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // Register Passport with the default JWT strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configure JWT Module asynchronously with options from ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          // Retrieve JWT secret from the configuration
          secret: config.get<string>('JWT_SECRET'),

          // Retrieve JWT expiration from the configuration
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),

    // Configure MongooseModule to use the User schema
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // Register the ConfigModule for configuration service
    ConfigModule.forRoot(),
  ],

  // Declare the AuthController as a part of this module
  controllers: [AuthController],

  // Declare AuthService and JwtStrategy as providers within this module
  providers: [AuthService, JwtStrategy],

  // Export AuthService, JwtStrategy, and PassportModule for external usage
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
