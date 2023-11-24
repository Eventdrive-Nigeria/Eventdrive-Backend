import { Injectable } from '@nestjs/common';
import { CreateVenueDto } from './dto/createvenue.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Venue } from './schemas/event.schema';

@Injectable()
export class EventService {
  constructor(@InjectModel(Venue.name) private venueModel: Model<Venue>,
    @InjectModel(Venue.name) private vendorModel: Model<Venue>,
  ) { }

  async getEvents() {
    try {
      const venues = await this.venueModel
        .find({})
        .populate('vendor', '', this.vendorModel)
        .exec();
      if (venues.length <= 0) {
        return 'nothing has been created yet';
      }
      return venues;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  getEvent(id: string) {
    return { id };
  }
  async createEvent(data: CreateVenueDto) {
    try {
      const media = data.media;

      const venue = await this.venueModel.create({
        ...data,
        media,
      });

      return venue;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  updateEvent(id: string, data: CreateVenueDto) {
    return { id, data };
  }
  deleteEvent(id: string) {
    return { id };
  }
}
