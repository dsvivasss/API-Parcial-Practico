/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AirlineAirportService } from './airline-airport.service';
import { AirportDto } from 'src/airport/airport.dto';
import { AirportEntity } from 'src/airport/airport.entity';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {
    constructor(private readonly airlineAirportService: AirlineAirportService) { }

    @Post(':airlineId/airports/:airportId')
    async addAirportToAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string) {
        return await this.airlineAirportService.addAirportToAirline(airlineId, airportId);
    }

    @Get(':airlineId/airports/:airportId')
    async findAirportFromAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string) {
        return await this.airlineAirportService.findAirportFromAirline(airlineId, airportId);
    }

    @Get(':airlineId/airports')
    async findAirportsFromAirline(@Param('airlineId') airlineId: string) {
        return await this.airlineAirportService.findAirportsFromAirline(airlineId);
    }

    @Put(':airlineId/airports')
    async updateAirportsFromAirline(@Body() airportsDto: AirportDto[], @Param('airlineId') airlineId: string) {
        const airports = plainToInstance(AirportEntity, airportsDto)
        return await this.airlineAirportService.updateAirportsFromAirline(airlineId, airports);
    }

    @Delete(':airlineId/airports/:airportId')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string) {
        return await this.airlineAirportService.deleteAirportFromAirline(airlineId, airportId);
    }
}