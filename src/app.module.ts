import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { customConfig, validate } from './config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,

			load: [customConfig],
			validate,
		}),
	],
})
export class AppModule {}
