# OBRIO

## Task description

<details>
  <summary>Open</summary>
  
  Task is to implement a service for user acquisition that stores users in DB and allows for those users to make purchases. [Link to task page](https://sites.google.com/gen.tech/back-end-developer/home)

### Entities:

- user (email, marketing data),
- offer (name, price),
- purchase (offer id, user id).

### REST Use cases:

#### Create user

Input: email, marketing data.

Result: Store user to Postgres.

#### Create purchase

Input: user id, offer id.

Result: Store purchase to Postgres.

Send event to analytics service (fake http request to somewhere).

Send astrological report to user (another fake http request after 24 hours).

### Requirements:

Use Nest.js

Just a single service.

No need for authorization.

No need to setup eslint, prettier, CI/CD and so on

Use VSC (GitHub, GitLab, etc.) to publish your completed task.

### Expectation:

Splitting code into layers like business logic, infrastructure, ui, etc. (layers responsibilities and naming is up to you) .

Clear naming of classes, modules, variables, functions.

No comments, no typos, no unused code.

</details>

## Additional improvements

### Uniform Service Response vs. Throwing Errors

Although NestJS provides interceptors for error handling, throwing errors in services is generally considered an anti-pattern. To avoid this, we can create and use a utility class to standardize all service function outputs. For example, we could use a class like this:

<details>
    <summary>ServiceResponse class</summary>

```typescript
class ServiceResponse<TSuccess, TFail> {
	constructor(
		private readonly successData: TSuccess | null,
		private readonly failData: TFail | null
	) {}

	static success = <TSuccess, TFail>(data: TSuccess): ServiceResponse<TSuccess, TFail> => {
		return new ServiceResponse(data, null);
	};

	static fail = <TSuccess, TFail>(data: TFail): ServiceResponse<TSuccess, TFail> => {
		return new ServiceResponse(null, data);
	};

	isSuccess = () => {
		return this.successData !== null;
	};

	extract = () => {
		return this.isSuccess() ? this.successData : this.failData;
	};
}
```

</details>

After that, we can modify our code like this:

```diff
const existingUser = await this.userRepository.findOne({ where: { email } });

if (existingUser) {
-	throw new ConflictException('User with this email already exists');
+   return ServiceResponse.fail(new ConflictException('User with this email already exists))
}
```

We can now create an adapter to handle the conversion of ServiceResponse into an appropriate HTTP response:

<details>
<summary>HttpAdapter Example</summary>

```typescript
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

export class HttpAdapter {
	static handleResponse<TSuccess, TFail>(
		res: Response,
		serviceResponse: ServiceResponse<TSuccess, TFail>
	) {
		if (serviceResponse.isSuccess()) {
			return res.status(200).json({
				status: 'success',
				data: serviceResponse.extract(),
			});
		} else {
			const error = serviceResponse.extract();
			return res.status(400).json({
				status: 'fail',
				error: error instanceof Error ? error.message : error,
			});
		}
	}
}
```

</details>

This HTTP adapter ensures that all responses follow a unified format.

### Swagger documentation

To ensure our API documentation is always up to date, we can use the nestjs/swagger library to automatically generate Swagger documentation from our controllers. Here's an example:

<details>
<summary>Updated CreateUserDto</summary>

```typescript
import { IsEmail, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({ example: 'test@example.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: { optIn: true } })
	@IsObject()
	@IsNotEmpty()
	marketingData: Record<string, any>;
}
```

</details>

<details>
<summary>Updated AcquisitionController</summary>

```typescript
@ApiOperation({ summary: 'Create a new user' })
@ApiBody({ type: CreateUserDto })
@ApiResponse({ status: 201, description: 'User successfully created.' })
@Post('users')
async createUser(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto
) {
    try {
        return this.acquisitionService.createUser(createUserDto);
    } catch (error) {
        throw new BadRequestException(error.message);
    }
}
```

</details>
