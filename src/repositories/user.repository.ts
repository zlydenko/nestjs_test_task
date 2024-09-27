import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { User } from '../entities';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>
	) {}

	async create(email: string, marketingData: Record<string, any>): Promise<User> {
		const user = this.userRepo.create({ email, marketingData });

		return this.userRepo.save(user);
	}

	async findOne(q: FindOptionsWhere<User>): Promise<User> {
		const user = await this.userRepo.findOne({
			where: q,
		});

		if (!user) {
			throw new Error(`With query ${q} user not found`);
		}

		return user;
	}
}
