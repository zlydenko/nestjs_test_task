import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Purchase, User, Offer } from '../entities';

@Injectable()
export class PurchaseRepository {
	constructor(
		@InjectRepository(Purchase)
		private readonly purchaseRepo: Repository<Purchase>
	) {}

	async createPurchase(user: User, offer: Offer): Promise<Purchase> {
		const purchase = this.purchaseRepo.create({ user, offer });
		return this.purchaseRepo.save(purchase);
	}
}
