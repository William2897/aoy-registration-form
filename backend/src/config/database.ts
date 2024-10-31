import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Registration } from '../entities/Registration';
import { KidsDetail } from '../entities/KidsDetail'; // Import the KidsDetail entity
import { TshirtOrder } from '../entities/TshirtOrder'; // Import the User entity

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  entities: [Registration, KidsDetail, TshirtOrder,'src/server/entities/**/*.ts'], // Include the KidsDetail entity
  migrations: ['src/server/migrations/**/*.ts'],
  synchronize: true, // process.env.NODE_ENV === 'development', this will auto create tables in the database if they do not exist
  logging: process.env.NODE_ENV === 'development'
});