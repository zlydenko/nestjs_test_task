import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Offer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	price: number;
}
