import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from '.';
import { Offer } from '.';

@Entity()
export class Purchase {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
	user: User;

	@ManyToOne(() => Offer)
	offer: Offer;
}
