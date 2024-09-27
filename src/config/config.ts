export interface EnvVariables {
	port: number;
	database: {
		name: string;
		host: string;
		port: number;
		username: string;
		password: string;
	};
}

export const customConfig = () => ({
	port: parseInt(process.env.PORT, 10),
	database: {
		name: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT, 10),
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
	},
});
