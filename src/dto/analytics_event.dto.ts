import { IsNotEmpty, IsNumber } from 'class-validator';

export class AnalyticsEventDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsNumber()
	offerId: number;
}
