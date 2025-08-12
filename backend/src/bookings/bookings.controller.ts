import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Req() req,
    @Body() body: { providerId: number; date: string; timeSlot: string },
  ) {
    return this.bookingsService.createBooking(
      req.user.id,
      body.providerId,
      body.date,
      body.timeSlot,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/cancel')
  async cancel(@Req() req, @Param('id') id: string) {
    return this.bookingsService.cancelBooking(Number(id), req.user.id);
  }

  @Get(':userId')
  async getUserBookings(@Param('userId') userId: string) {
    const id = Number(userId);
    return this.bookingsService.findBookingsByCustomerId(id);
  }
}
