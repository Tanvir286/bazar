import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import {config}  from 'dotenv';
config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [UserEntity],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    logging: false,
    synchronize: false,
};

export const dataSource = new DataSource(dataSourceOptions);
