import { Controller, Get, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('/:eventId')
  getTickets(@Param('eventId') eventId: string) {
    return this.ticketsService.getTickets(eventId);
  }
}
