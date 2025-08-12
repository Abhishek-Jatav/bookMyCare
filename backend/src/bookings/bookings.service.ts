import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(
    customerId: number,
    providerId: number,
    date: string,
    timeSlot: string,
  ) {
    const bookingDate = new Date(date);

    // 1️⃣ Check if provider is available for that date & slot
    const isAvailable = await this.prisma.availability.findFirst({
      where: {
        providerId,
        date: bookingDate,
        timeSlot,
        isBooked: false,
      },
    });

    if (!isAvailable) {
      throw new BadRequestException('Provider not available for this slot');
    }

    // 2️⃣ Check if slot already booked in Bookings table
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        providerId,
        date: bookingDate,
        timeSlot,
        status: 'BOOKED',
      },
    });

    if (existingBooking) {
      throw new BadRequestException('This slot is already booked');
    }

    // 3️⃣ Create booking
    const booking = await this.prisma.booking.create({
      data: {
        date: bookingDate,
        timeSlot,
        providerId,
        customerId,
        status: 'BOOKED',
      },
    });

    // 4️⃣ Mark availability as booked
    await this.prisma.availability.update({
      where: { id: isAvailable.id },
      data: { isBooked: true },
    });

    return booking;
  }

  async cancelBooking(bookingId: number, customerId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.customerId !== customerId)
      throw new ForbiddenException('Not allowed to cancel this booking');

    // 1️⃣ Mark booking as cancelled
    const cancelledBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    // 2️⃣ Free up the slot in availability table
    await this.prisma.availability.updateMany({
      where: {
        providerId: booking.providerId,
        date: booking.date,
        timeSlot: booking.timeSlot,
      },
      data: { isBooked: false },
    });

    return cancelledBooking;
  }

  async findBookingsByCustomerId(customerId: number) {
    return this.prisma.booking.findMany({
      where: { customerId },
      orderBy: { date: 'desc' },
    });
  }
}
