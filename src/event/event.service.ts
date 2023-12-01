import { Injectable } from '@nestjs/common';
import { CreateVenueDto } from './dto/createvenue.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Venue } from './schemas/event.schema';

@Injectable()
export class EventService {
  constructor(@InjectModel(Venue.name) private venueModel: Model<Venue>
  ) { }

  async getEvents() {
    try {
      const events = await this.venueModel.find({});
      if (events.length <= 0) {
        return 'nothing has been created yet';
      }
      return events;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getEvent(id: string) {
    try {
      const event = await this.venueModel.findById({ _id: id });
      if (!event) return 'no event with the specified id';
      return event;
    } catch (error) {
      console.log(error);
      return error;
    }
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
  async updateEvent(id: string, data: CreateVenueDto) {
    try {
      const event = await this.venueModel.findByIdAndUpdate(
        { _id: id },
        { ...data },
      );
      return event;
    } catch (error) {
      return error;
    }
  }
  async deleteEvent(id: string) {
    try {
      const event = await this.venueModel.findByIdAndDelete({ _id: id });
      return event;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
