// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingsModule } from './bookings/bookings.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env
    PrismaModule,
    AuthModule, // Auth module for authentication and authorization
    AvailabilityModule, // Module for managing availability slots
    BookingsModule, // Bookings module for handling bookings
    ProvidersModule, // Module for managing providers
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
