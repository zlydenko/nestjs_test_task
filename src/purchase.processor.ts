import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Axios } from 'axios';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { AnalyticsEventDto, AstrologyReportDto } from './dto';

@Processor('purchases')
export class PurchaseProcessor {
	private readonly axios = new Axios();

	@Process('analytics-event')
	async handleAnalyticsEvent(job: Job<AnalyticsEventDto>) {
		const inputData = plainToInstance(AnalyticsEventDto, job.data);
		const errors = validateSync(inputData);

		if (errors.length > 0) {
			throw new Error(`Validation failed for analytics event job: ${JSON.stringify(errors)}`);
		}

		const { userId, offerId } = inputData;

		await this.axios.post('https://fake-analytics-service.com/event', {
			event: 'purchase',
			userId,
			offerId,
		});
	}

	@Process('astrology-report')
	async handleAstrologicalReport(job: Job<AstrologyReportDto>) {
		const inputData = plainToInstance(AstrologyReportDto, job.data);
		const errors = validateSync(inputData);

		if (errors.length > 0) {
			throw new Error(`Validation failed for astrology report job: ${JSON.stringify(errors)}`);
		}

		const { userId } = inputData;

		await this.axios.post('https://fake-astrology-service.com/report', { userId });
	}
}
