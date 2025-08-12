import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

class CreateSlotDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  timeSlot: string;
}

@Controller('availability')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER)
  @Post()
  createSlot(@Req() req, @Body() dto: CreateSlotDto) {
    return this.availabilityService.createSlot(
      req.user.userId,
      req.user.role,
      new Date(dto.date),
      dto.timeSlot,
    );
  }

  @Get(':providerId')
  getSlots(
    @Param('providerId') providerId: string,
    @Query('date') date?: string,
  ) {
    return this.availabilityService.getSlots(parseInt(providerId), date);
  }
}
