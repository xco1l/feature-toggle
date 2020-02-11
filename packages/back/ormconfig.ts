import {Entity} from './src/entities/entity';

export = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'ft_app',
  password: 'ghjcnjgfhjkm',
  database: 'ft_db',
  entities: [Entity],
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: {
    migrationsDir: './src/migrations',
  },
};
