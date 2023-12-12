import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Vendor } from "./model/vendor.schema";
import { Model } from "mongoose";
import { CreateVendor } from "./dto/cretateVendor.dto";
import { LoginVendorDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { comparePassword, hashed } from "src/auth/hashedPassword/password.hashed";
import APIFeatures from "src/common/locationApi/location.api";
import { VendorChangedPasswordDto } from "./email_auth/dto/changepassword.dto";

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<Vendor>,
    private jwtService: JwtService
  ) {}

  async registerVendor(input: CreateVendor): Promise<any> {
    try {
      const vendor = await this.vendorModel.findOne({
        $or: [
          { email: input.email },
          { userName: input.userName }
        ]
      }).exec();

      if (vendor) {
        throw new HttpException(
          `A vendor with the email '${input.email}' already exists.
          check if it's your details
          business Name: ${vendor.buinessName}, 
          Owner: ${vendor.fullName}`,
          HttpStatus.UNPROCESSABLE_ENTITY
      );
      }

      input.email = input.email.toLowerCase();
      input.userName= input.userName.toLowerCase()

      input.password = await hashed(input.password);
      const address = input.bussinessAddress
      const location = await APIFeatures.getByLocationByMapquest(address.street, address.city)

      console.log(location)

      const createVendor = await this.vendorModel.create({
        ...input,
       location: location,
       bussinessaddress: address
      });
    

      return createVendor;

    } catch (error) {
      throw error || new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginvendor(input: LoginVendorDto) {
   
    try {
      const user = await this.vendorModel.findOne({
          userName: input.userName.toLowerCase()
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
      throw  error || new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //to keep trace of currect logged in vendor, also work on user and other when included
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

  async vendorchangepassword(id: string, input: VendorChangedPasswordDto){
    const vendor = await this.vendorModel.findById(id);
    try {
      if (!vendor) {
      throw new HttpException('vendor with such id does not exist', HttpStatus.UNPROCESSABLE_ENTITY)
      }

      if (input.password !==input.confirmedPassword) {
        throw new HttpException('your password and confirmed password do not matched', HttpStatus.UNPROCESSABLE_ENTITY)
      }

      if (await comparePassword(input.confirmedOldPassword, vendor.password) === false) {
        throw new HttpException('your confirmed old password do not matched', HttpStatus.UNPROCESSABLE_ENTITY)
      }

      input.password = await hashed(input.password)

       await this.vendorModel.findByIdAndUpdate(vendor, input,{
        new: true,
        runValidators: true
    })

    return 'password updated successfully'

    } catch (error) {
      console.log(error)
      throw error 
    }


  }

}
