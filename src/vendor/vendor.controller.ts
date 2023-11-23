import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateEventDto } from './dto/createevent.dto';

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) { }

  @Get()
  getEvents() {
    return this.vendorService.getEvents();
  }
  @Get(':id')
  getEvent(@Param('id') id: string) {
    return this.vendorService.getEvent(id);
  }
  @Post()
  createEvent(@Body() eventData: CreateEventDto) {
    return this.vendorService.createEvent(eventData);
  }
  @Patch(':id')
  updateEvent(@Param('id') id: string, @Body() eventData: CreateEventDto) {
    return this.vendorService.updateEvent(id, eventData);
  }
  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.vendorService.deleteEvent(id);
  }
}
