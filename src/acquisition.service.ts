import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePurchaseDto, CreateUserDto } from './dto';
import { Offer, Purchase, User } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class AcquisitionService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Purchase)
		private readonly purchaseRepository: Repository<Purchase>,
		@InjectRepository(Offer)
		private readonly offerRepository: Repository<Offer>
	) {}

	private sendAnalyticsEvent() {}

	private sendAstrologicalReport() {}

	async createUser(createUserInput: CreateUserDto) {
		const { email, marketingData } = createUserInput;
		const existingUser = await this.userRepository.findOne({ where: { email } });

		if (existingUser) {
			throw new ConflictException('User with this email already exists');
		}

		const newUser = this.userRepository.create({ email, marketingData });
		return this.userRepository.save(newUser);
	}

	async createPurchase(createPurchaseInput: CreatePurchaseDto) {
		const { userId, offerId } = createPurchaseInput;

		const user = await this.userRepository.findOneBy({ id: userId });
		const offer = await this.offerRepository.findOneBy({ id: offerId });

		const purchase = await this.purchaseRepository.create({ user, offer });

		this.sendAnalyticsEvent();
		this.sendAstrologicalReport();

		return purchase;
	}
}
