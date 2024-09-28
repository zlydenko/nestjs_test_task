import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

import { AcquisitionService } from './acquisition.service';
import { CreateUserDto, CreatePurchaseDto } from './dto';

@Controller('acquisition')
export class AcquisitionController {
	constructor(private readonly acquisitionService: AcquisitionService) {}

	@Post('users')
	async createUser(
		@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
		createUserDto: CreateUserDto
	) {
		return this.acquisitionService.createUser(createUserDto);
	}

	@Post('purchases')
	async createPurchase(
		@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
		createPurchaseDto: CreatePurchaseDto
	) {
		return this.acquisitionService.createPurchase(createPurchaseDto);
	}
}
