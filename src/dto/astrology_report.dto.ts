import { IsNotEmpty, IsNumber } from 'class-validator';

export class AstrologyReportDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;
}
