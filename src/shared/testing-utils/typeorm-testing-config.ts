/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from 'src/airline/airline.entity';
import { AirportEntity } from 'src/airport/airport.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [AirlineEntity, AirportEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([AirlineEntity, AirportEntity]),
];
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/