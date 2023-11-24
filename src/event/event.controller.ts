import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateVenueDto } from './dto/createvenue.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }
  @Get()
  getEvents() {
    return this.eventService.getEvents();
  }
  @Get(':id')
  getEvent(@Param('id') id: string) {
    return this.eventService.getEvent(id);
  }
  @Post()
  createEvent(@Body() data: CreateVenueDto) {
    return this.eventService.createEvent(data);
  }
  @Patch(':id')
  updateEvent(@Param('id') id: string, @Body() data: CreateVenueDto) {
    return this.eventService.updateEvent(id, data);
  }
  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
