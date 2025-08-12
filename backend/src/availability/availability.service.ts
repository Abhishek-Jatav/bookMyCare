import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async createSlot(userId: number, role: Role, date: Date, timeSlot: string) {
    if (role !== Role.PROVIDER) {
      throw new ForbiddenException('Only providers can set availability');
    }

    try {
      return await this.prisma.availability.create({
        data: {
          providerId: userId,
          date,
          timeSlot,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BadRequestException('Slot already exists');
      }
      throw err;
    }
  }

  async getSlots(providerId: number, date?: string) {
    return this.prisma.availability.findMany({
      where: {
        providerId,
        ...(date ? { date: new Date(date) } : {}),
      },
      orderBy: { timeSlot: 'asc' },
    });
  }
}
