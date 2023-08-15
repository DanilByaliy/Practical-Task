import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

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
}
