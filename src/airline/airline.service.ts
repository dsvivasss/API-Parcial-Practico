import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find();
  }

  async findOne(id: string): Promise<AirlineEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return airline;
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    const date = new Date(airline.date);

    if (date > new Date())
      throw new BusinessLogicException(
        'The date must be in the past',
        BusinessError.INVALID_INPUT,
      );

    return await this.airlineRepository.save(airline);
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const persistedAirline: AirlineEntity =
      await this.airlineRepository.findOne({
        where: { id },
      });

    if (!persistedAirline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const date = new Date(persistedAirline.date);

    if (date > new Date())
      throw new BusinessLogicException(
        'The date must be in the past',
        BusinessError.INVALID_INPUT,
      );

    return await this.airlineRepository.save({
      ...persistedAirline,
      ...airline,
    });
  }

  async delete(id: string) {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.airlineRepository.remove(airline);
  }
}
