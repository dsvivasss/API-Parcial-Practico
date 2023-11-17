/* eslint-disable prettier/prettier */
/*archivo src/airline/airline.service.spec.ts*/
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';

import { faker } from '@faker-js/faker';


describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for (let i = 0; i < 5; i++) {
      const airline: AirlineEntity = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        date: faker.date.past().toISOString(),
        website: faker.internet.url(),
      })
      airlinesList.push(airline);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne should return a airline by id', async () => {
    const storedAirline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name)
    expect(airline.description).toEqual(storedAirline.description)
    expect(airline.date).toEqual(storedAirline.date)
    expect(airline.website).toEqual(storedAirline.website)
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: '1000000',
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      date: faker.date.past().toISOString(),
      website: faker.internet.url(),
      airports: []
    }

    const newRecipy: AirlineEntity = await service.create(airline);
    expect(newRecipy).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({ where: { id: newRecipy.id } })
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(newRecipy.name)
    expect(storedAirline.description).toEqual(newRecipy.description)
    expect(storedAirline.date).toEqual(newRecipy.date)
    expect(storedAirline.website).toEqual(newRecipy.website)
  });

  it('update should modify a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.name = "New name";
    airline.description = "New Description";

    const updatedRecipy: AirlineEntity = await service.update(airline.id, airline);
    expect(updatedRecipy).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name)
    expect(storedAirline.description).toEqual(airline.description)
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline, name: "New name", description: "New description"
    }
    await expect(() => service.update("0", airline)).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('delete should remove a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);

    const deletedRecipy: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(deletedRecipy).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

});