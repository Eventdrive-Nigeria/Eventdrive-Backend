import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from 'src/vendor/model/vendor.schema';
import * as crypto from'crypto'
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDTO } from './dto/resetpasword.dto';
import { comparePassword, hashed } from '../hashedPassword/password.hashed';
import { confirmedVendorEmailDTO } from './dto/confirmedvendor.email.dto';
import { ForgetPasswordDto } from './dto/forgotpassword.dto';
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

    ///logic to send token to confirmed vendor that sign up account
    async sendVendorConfirmation(input: Vendor){

      const vendor = await this.vendorModel.findOne({email: input.email})
      // const emailtoken = Math.floor(1000 + Math.random() * 9000).toString();
      const emailtoken =crypto.randomBytes(8).toString('hex');
      const emailtTokenExpirationTime = new Date()
      emailtTokenExpirationTime.setDate(emailtTokenExpirationTime.getDate()+ 1);
      
      console.log(emailtoken)

      vendor.emailConfirmedToken = emailtoken
      vendor.emailTokenExpiration = emailtTokenExpirationTime;

      await vendor.save()

      const sendmail={
          from: 'infor@eventdrive.com',
          to: vendor.email,
          subject: 'confirmed your email',
          Text: `Click the following link to reset your password: https://yourwebsite.com/reset-password?token=${emailtoken}`

          
      }
      console.log(`token send to this email ${sendmail.to}`)
      
      try {
          const info = await this.transporter.sendMail(sendmail);
          return info;

        } catch (error) {
          throw new Error(error.message);
        }  
     
  }

  //vendor confirm email 
  async confirmedVendorEmail(input: confirmedVendorEmailDTO):Promise<any> {
    //console.log(input)
    const vendor  = await this.vendorModel.findOne({email: input.email})
    if (!vendor) {
        throw new HttpException('please check your email address', HttpStatus.NOT_FOUND)
    }
    if (vendor.emailConfirmedToken !== input.confirmedToken || vendor.emailTokenExpiration< new Date()) {
        throw new HttpException('wrong credential or token has expired', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    if (vendor.emailConfirmed === true) {
      throw new HttpException('your account is already verified', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    
    vendor.emailConfirmed = true;
    vendor.emailConfirmedToken = null;
    vendor.emailTokenExpiration = null;

    await vendor.save()

    return {
        info: 'you are now verified'
    }
 }

//logice for forget password to get generate token to the vendor
    async vendorForgetPassword(body: ForgetPasswordDto){
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
            await this.transporter.sendMail(emailMessage);
            return `reset token sent, kindly check your email ${body.email} or spam`;
          } catch (error) {
            throw new Error(error.message);
          } 

      }

      //this is to reset the vendor password
      async resetVendorPassword(input: ResetPasswordDTO) {
        const vendor = await this.vendorModel.findOne({email:input.email })
    
          if (!vendor) {
            throw new HttpException('check your email spelling', HttpStatus.NOT_FOUND)
        }
        if (vendor.resetToken !== input.token || vendor.resetTokenExpiration < new Date()) {
            throw new Error('inavlid or expired reset token')
        }
        
        if (input.newPassword !== input.confirmedNewPassword) {
            throw new HttpException('password does not matched', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        
      
        if (await comparePassword(input.newPassword, vendor.password) === true) {
          throw new HttpException('new password can not be same as old password', HttpStatus.FORBIDDEN)
      }

        // if (vendor.password === hashChangedPassword) {
        //   throw new HttpException('new password can not be same as old password', HttpStatus.FORBIDDEN)
        // }
        // vendor.password = await hashed(input.newPassword);
        const hashChangedPassword= await hashed(input.newPassword);

        vendor.password = hashChangedPassword

        vendor.resetToken = null;
        vendor.resetTokenExpiration = null;
        
        await vendor.save()
        return {
            info: 'password change successfull'
        }
    }
}
