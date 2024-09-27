import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { customConfig, validate } from './config';
import { User, Offer, Purchase } from './entities';
import { AcquisitionService } from './acquisition.service';
import { AcquisitionController } from './acquisition.controller';
import { PurchaseProcessor } from './purchase.processor';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,

			load: [customConfig],
			validate,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				type: 'postgres',
				host: config.get<string>('database.host'),
				port: config.get<number>('database.port'),
				username: config.get<string>('database.username'),
				password: config.get<string>('database.password'),
				database: config.get<string>('database.name'),
				entities: [User, Offer, Purchase],
			}),
		}),
		TypeOrmModule.forFeature([User, Offer, Purchase]),
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				redis: {
					host: config.get<string>('redis.host'),
					port: config.get<number>('redis.port'),
				},
			}),
		}),
		BullModule.registerQueue({
			name: 'purchases',
		}),
	],
	providers: [AcquisitionService, PurchaseProcessor],
	controllers: [AcquisitionController],
})
export class AppModule {}
