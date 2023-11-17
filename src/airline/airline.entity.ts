import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AirportEntity } from 'src/airport/airport.entity';

/* eslint-disable prettier/prettier */

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
    @JoinTable()
    airports: AirportEntity[];
}