import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/createevent.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor } from './schemas/vendor.schema';
import { Model } from 'mongoose';
@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) { }

  async getEvents() {
    try {
      const vendors = await this.vendorModel.find({});
      if (vendors.length <= 0) {
        return 'nothing has been created yet';
      }
      return vendors;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getEvent(id: string) {
    try {
      const vendor = await this.vendorModel.findById(id);

      if (!vendor) {
        return 'cannot find any data with the specified id';
      }

      return vendor;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async createEvent(createdEvent: CreateEventDto) {
    try {
      // Hash the user's password before storing it in the database
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createdEvent.password,
        saltOrRounds,
      );

      const media = createdEvent.media;

      console.log(media, createdEvent.media);

      // Create a new user with the hashed password
      const vendor = await this.vendorModel.create({
        ...createdEvent,
        password: hashedPassword,
        media,
      });

      return vendor;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateEvent(id: string, updatedEvent: CreateEventDto) {
    const vendor = await this.vendorModel.findByIdAndUpdate(
      { _id: id },
      { ...updatedEvent },
    );

    return vendor;
  }

  async deleteEvent(id: string) {
    const vendor = await this.vendorModel.findByIdAndDelete({ _id: id });

    return vendor;
  }
}
