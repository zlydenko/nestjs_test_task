import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Offer } from '../entities';

@Injectable()
export class OfferRepository {
	constructor(
		@InjectRepository(Offer)
		private readonly offerRepo: Repository<Offer>
	) {}

	async findById(id: number): Promise<Offer> {
		const offer = await this.offerRepo.findOne({ where: { id } });

		if (!offer) {
			throw new Error(`Offer ${id} not found`);
		}

		return offer;
	}
}
