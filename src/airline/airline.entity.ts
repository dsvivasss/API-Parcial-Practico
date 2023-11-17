import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AirportEntity } from 'src/airport/airport.entity';

/* eslint-disable prettier/prettier */
// import { ExhibitionEntity } from '../exhibition/exhibition.entity';

@Entity()
export class AirlineEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    date: string;

    @Column()
    website: string;

    @ManyToMany(() => AirportEntity, airport => airport.airlines)
    airports: AirportEntity[];
}