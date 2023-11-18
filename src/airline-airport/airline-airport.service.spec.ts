/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AirportEntity } from 'src/airport/airport.entity';
import { Repository } from 'typeorm';
import { AirlineEntity } from 'src/airline/airline.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineAirportService } from './airline-airport.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airline: AirlineEntity;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    airportRepository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();

    airportsList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await airportRepository.save({
        name: faker.company.name(),
        code: faker.string.alphanumeric(3),
        country: faker.location.country(),
        city: faker.location.city(),
      })
      airportsList.push(airport);
    }

    airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      date: faker.date.past().toISOString(),
      website: faker.internet.url(),
      airports: airportsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an airport to an airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alphanumeric(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      date: faker.date.past().toISOString(),
      website: faker.internet.url(),
    })

    const result: AirlineEntity = await service.addAirportToAirline(newAirline.id, newAirport.id);

    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toBe(newAirport.name)
    expect(result.airports[0].code).toBe(newAirport.code)
    expect(result.airports[0].country).toBe(newAirport.country)
    expect(result.airports[0].city).toBe(newAirport.city)
  });

  it('addAirportToAirline should thrown an exception for an invalid airport', async () => {
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      date: faker.date.past().toISOString(),
      website: faker.internet.url(),
    })

    await expect(() => service.addAirportToAirline(newAirline.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('addAirportToAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alphanumeric(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(() => service.addAirportToAirline("0", newAirport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportFromAirline should return an airport from an airline', async () => {
    const airport: AirportEntity = airportsList[0];
    const storedAirport: AirportEntity = await service.findAirportFromAirline(airline.id, airport.id,)
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toBe(airport.name);
    expect(storedAirport.code).toBe(airport.code);
    expect(storedAirport.country).toBe(airport.country);
    expect(storedAirport.city).toBe(airport.city);
  });

  it('findAirportFromAirline should throw an exception for an invalid airport', async () => {
    await expect(() => service.findAirportFromAirline(airline.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('findAirportFromAirline should throw an exception for an invalid airline', async () => {
    const artwork: AirportEntity = airportsList[0];
    await expect(() => service.findAirportFromAirline("0", artwork.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportFromAirline should throw an exception for an airport not associated to the airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alphanumeric(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(() => service.findAirportFromAirline(airline.id, newAirport.id)).rejects.toHaveProperty("message", "The airport with the given id is not associated to the airline");
  });

  it('findAirportsFromAirline should return all airports from an airline', async () => {
    const airports: AirportEntity[] = await service.findAirportsFromAirline(airline.id);
    expect(airports.length).toBe(5)
  });

  it('findAirportsFromAirline should throw an exception for an invalid airline', async () => {
    await expect(() => service.findAirportsFromAirline("0")).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('updateAirportsFromAirline should update the airports from an airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alphanumeric(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    const updatedAirline: AirlineEntity = await service.updateAirportsFromAirline(airline.id, [newAirport]);
    expect(updatedAirline.airports.length).toBe(1);

    expect(updatedAirline.airports[0].name).toBe(newAirport.name);
    expect(updatedAirline.airports[0].code).toBe(newAirport.code);
    expect(updatedAirline.airports[0].country).toBe(newAirport.country);
    expect(updatedAirline.airports[0].city).toBe(newAirport.city);
  });

  it('updateAirportsFromAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alphanumeric(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(() => service.updateAirportsFromAirline("0", [newAirport])).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('updateAirportsFromAirline should throw an exception for an invalid airport', async () => {
    const newAirport: AirportEntity = airportsList[0];
    newAirport.id = "0";

    await expect(() => service.updateAirportsFromAirline(airline.id, [newAirport])).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('deleteAirportFromAirline should remove an airport from an airline', async () => {
    const airport: AirportEntity = airportsList[0];

    await service.deleteAirportFromAirline(airline.id, airport.id);

    const storedAirline: AirlineEntity = await airlineRepository.findOne({ where: { id: airline.id }, relations: ["airports"] });
    const deletedAirport: AirportEntity = storedAirline.airports.find(a => a.id === airport.id);

    expect(deletedAirport).toBeUndefined();

  });

  it('deleteAirportFromAirline should thrown an exception for an invalid airport', async () => {
    await expect(() => service.deleteAirportFromAirline(airline.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('deleteAirportFromAirline should thrown an exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(() => service.deleteAirportFromAirline("0", airport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('deleteAirportFromAirline should thrown an exception for an non asocciated airport', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alphanumeric(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(() => service.deleteAirportFromAirline(airline.id, newAirport.id)).rejects.toHaveProperty("message", "The airport with the given id is not associated to the airline");
  });

});