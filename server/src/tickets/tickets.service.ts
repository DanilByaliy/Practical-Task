import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom } from 'rxjs';

interface Section {
  Id: number;
  Description: string;
}

@Injectable()
export class TicketsService implements OnModuleInit {
  sections: object = {};

  constructor(private readonly httpService: HttpService) {}

  async onModuleInit() {
    this.httpService
      .get(
        'https://my.laphil.com/en/rest-proxy/ReferenceData/Sections?seatMapId=12',
      )
      .pipe(
        map((res) => res.data as Array<Section>),
        map((sections) => {
          sections.forEach(({ Id, Description }) => {
            this.sections[Id] = Description;
          });
        }),
      );
  }

  async getTickets(eventId: string) {
    const seats = await firstValueFrom(
      this.httpService
        .get(
          `https://my.laphil.com/en/rest-proxy/TXN/Packages/${eventId}/Seats?constituentId=0&modeOfSaleId=26&packageId=${eventId}`,
        )
        .pipe(map((res) => res.data)),
    );

    const prices = await firstValueFrom(
      this.httpService
        .get(
          `https://my.laphil.com/en/rest-proxy/TXN/Packages/${eventId}/Prices?expandPerformancePriceType=&includeOnlyBasePrice=&modeOfSaleId=26&priceTypeId=&sourceId=30885`,
        )
        .pipe(map((res) => res.data)),
    );

    return seats
      .filter(({ SeatStatusId }) => !SeatStatusId)
      .map(({ SectionId, SeatRow, SeatNumber, ZoneId }) => {
        const Description = this.sections[SectionId];
        const { Price } = prices.find(({ ZoneId: id }) => id === ZoneId);
        return {
          Section: Description,
          Row: SeatRow,
          SeatNumber,
          Price,
        };
      });
  }
}
