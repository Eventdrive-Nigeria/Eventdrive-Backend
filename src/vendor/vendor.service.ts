import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/createevent.dto';

@Injectable()
export class VendorService {
  private vendors = [
    {
      id: 1,
      eventCenterName: 'peace-Camp',
      eventCenterAddress: 'downTown',
      eventCenterDescription: 'downTown',
      email: 'abc@gmail.com',
      phoneNumber: '1234',
      media: '123.jpeg',
      password: 'abc123',
      status: 'activated',
    },
    {
      id: 2,
      eventCenterName: 'violence-Camp',
      eventCenterAddress: 'upTown',
      eventCenterDescription: 'upTown',
      email: 'def@gmail.com',
      phoneNumber: '5678',
      media: '456.mp4',
      password: 'def456',
      status: 'suspended',
    },
  ];
  getEvents() {
    return this.vendors;
  }

  getEvent(id: number) {
    const vendor = this.vendors.find((vendor) => vendor.id === id);
    if (!vendor) {
      throw new Error('Event not found');
    }

    return vendor;
  }

  createEvent(createdEvent: CreateEventDto) {
    const vendor = {
      id: Date.now(),
      ...createdEvent,
    };
    this.vendors.push(vendor);

    return vendor;
  }

  updateEvent(id: number, updatedEvent: CreateEventDto) {
    this.vendors = this.vendors.map((vendor) => {
      if (vendor.id === id) {
        return { ...vendor, ...updatedEvent };
      }
      return vendor;
    });
    return this.getEvent(id);
  }

  deleteEvent(id: number) {
    const vendor = this.getEvent(id);
    this.vendors = this.vendors.filter((vendor) => vendor.id != id);
    return { vendor };
  }
}
