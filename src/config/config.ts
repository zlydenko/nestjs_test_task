const DEFAULT_PORT = 3000;
const DEFAULT_DB_PORT = 5432;

export interface EnvVariables {
	port: number;
	database: {
		host: string;
		port: number;
	};
}

export const customConfig = () => ({
	port: parseInt(process.env.PORT, 10) || DEFAULT_PORT,
	database: {
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT, 10) || DEFAULT_DB_PORT,
	},
});
