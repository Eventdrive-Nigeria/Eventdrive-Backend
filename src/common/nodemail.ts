import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';


//still checking for correction
export class NodeMailer {
    
    private transporter: nodemailer.Transporter;
    constructor(
        private configService: ConfigService
    ){
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
}