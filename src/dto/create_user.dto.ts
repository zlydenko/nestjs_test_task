import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	marketingData: Record<string, any>;
}
