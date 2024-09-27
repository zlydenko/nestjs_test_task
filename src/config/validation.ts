import { plainToInstance } from 'class-transformer';
import {
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	Min,
	validateSync,
	ValidationError,
} from 'class-validator';

class ConfigFileDTO {
	@IsNumber()
	@Min(0, { message: 'PORT must be greater than or equal to 0' })
	@Max(65535, { message: 'PORT must be less than or equal to 65535' })
	PORT: number;

	@IsString()
	@IsNotEmpty({ message: 'DATABASE_HOST cannot be empty' })
	DATABASE_HOST: string;

	@IsNumber()
	@Min(0, { message: 'DATABASE_PORT must be greater than or equal to 0' })
	@Max(65535, { message: 'DATABASE_PORT must be less than or equal to 65535' })
	DATABASE_PORT: number;

	@IsString()
	@IsNotEmpty({ message: 'DATABASE_NAME cannot be empty' })
	DATABASE_NAME: string;

	@IsString()
	@IsNotEmpty({ message: 'DATABASE_USER cannot be empty' })
	DATABASE_USER: string;

	@IsString()
	@IsNotEmpty({ message: 'DATABASE_PASS cannot be empty' })
	DATABASE_PASS: string;

	@IsString()
	@IsNotEmpty({ message: 'REDIS_HOST cannot be empty' })
	REDIS_HOST: string;

	@IsNumber()
	@Min(0, { message: 'REDIS_PORT must be greater than or equal to 0' })
	@Max(65535, { message: 'REDIS_PORT must be less than or equal to 65535' })
	REDIS_PORT: number;
}

const formatErrors = (errors: ValidationError[]): string => {
	return errors
		.map((e) => {
			return Object.values(e.constraints || {}).join(', ');
		})
		.join(';\n');
};

export const validate = (config: Record<string, unknown>) => {
	const validatedConfig = plainToInstance(ConfigFileDTO, config, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error('Missing or invalid environment variables!\n' + formatErrors(errors));
	}

	return validatedConfig;
};
