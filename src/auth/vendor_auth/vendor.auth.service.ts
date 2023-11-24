import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Vendor } from "./model/vendor.schema";
import { Model } from "mongoose";
import { CreateVendor } from "./dto/cretateVendor.dto";
import { hashed } from "../hashedPassword/password.hashed";
import { LoginVendorDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class Vendor_Auth_Service {
  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<Vendor>,
    private jwtService: JwtService
  ) {}

  async registerVendor(input: CreateVendor) {
    try {
      const vendor = await this.vendorModel.findOne({
        $or: [
          { email: input.email },
          { userName: input.userName }
        ]
      }).exec();

      if (vendor) {
        throw new HttpException('You already have an account', HttpStatus.UNPROCESSABLE_ENTITY);
      }

      input.password = await hashed(input.password);

      const createVendor = await this.vendorModel.create({
        ...input
      });

      return await createVendor.save();
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginvendor(input: LoginVendorDto) {
    try {
      const user = await this.vendorModel.findOne({

          email: input.email
  
        // $or: [
        //   { email: input.email },
        //   { userName: input.userName },
        // ],
      }).exec();

      if (!user) {
        throw new HttpException('You do not have an account', HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const payload = {
        user: user._id
      };
     

      return {
        accessToken: await this.jwtService.signAsync(payload)
      };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //to keep trace of currect logged in vendor, use also
  async generatejwt(id: string) {
    try {
      const vendor = await this.vendorModel.findById(id);
      if (vendor) {
        return vendor;
      }
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
