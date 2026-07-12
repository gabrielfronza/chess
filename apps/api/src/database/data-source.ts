/* istanbul ignore file -- CLI entrypoint; options are tested separately. */
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Environment, validateEnvironment } from '../config/environment';
import { createDataSourceOptions } from './typeorm-options';

config({ path: '../../.env' });
config();

const environment: Environment = validateEnvironment(process.env);

export default new DataSource(createDataSourceOptions(environment));
