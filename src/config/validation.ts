import { plainToInstance, Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min, validateSync } from 'class-validator';

class ConfigFileDTO {
	@IsNumber()
	@Min(0)
	@Max(65535)
	PORT: number;

	@IsString()
	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	DATABASE_HOST: string;

	@IsNumber()
	@Min(0)
	@Max(65535)
	DATABASE_PORT: number;
}

export const validate = (config: Record<string, unknown>) => {
	const validatedConfig = plainToInstance(ConfigFileDTO, config, {
		enableImplicitConversion: true,
	});
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	return validatedConfig;
};
