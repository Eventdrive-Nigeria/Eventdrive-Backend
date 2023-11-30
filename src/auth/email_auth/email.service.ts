import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from 'src/vendor/model/vendor.schema';
import { ForgetEmailDto } from './dto/forgetemail.dto';
import * as crypto from'crypto'
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
//import { NodeMailer } from 'src/common/nodemail';

@Injectable()
export class EmailService {
   private transporter: nodemailer.Transporter;

    constructor(@InjectModel(Vendor.name)
    private vendorModel: Model<Vendor>, 
    private configService: ConfigService
    ){
    //  NodeMailer
        this.transporter = nodemailer.createTransport({
            host: configService.get('MAIL_HOST'),
            port: 2525,
            secure: false,
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASSWORD')
            },

            tls: {
                rejectUnauthorized: false // Accept self-signed certificates (for debugging)
            }
          });
    }
//logice for forget password to get generate token to the vendor
    async vendorForgetPassword(body: ForgetEmailDto){
        const vendor = await this.vendorModel.findOne({
          email: body.email
        })
        if (!vendor) {
            throw new HttpException('email not found', HttpStatus.NOT_FOUND)
        }

        //if the vendor exist..generated token and send to the email provided

        const resetgenerateRandomToken = crypto.randomBytes(8).toString('hex')
        console.log(resetgenerateRandomToken)

        //to set the time the generated token will expired.. 1hour in this case
        const resetTokenExpirationTime = new Date();
        resetTokenExpirationTime.setHours(resetTokenExpirationTime.getHours()+ 1);

        vendor.resetToken = resetgenerateRandomToken;
        vendor.resetTokenExpiration=resetTokenExpirationTime;

        await vendor.save();

        const emailMessage = {
            from: 'infor@eventdrive.com',
            to: body.email,
            subject: 'password Reset',
            Text: `Click the following link to reset your password: https://yourwebsite.com/reset-password?token=${resetgenerateRandomToken}`
          }

          try {
            const info = await this.transporter.sendMail(emailMessage);
            return info;
          } catch (error) {
            throw new Error(error.message);
          } 

      }
}
