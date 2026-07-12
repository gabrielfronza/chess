import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from '../config/environment';
import { createTypeOrmModuleOptions } from './typeorm-options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment, true>) =>
        createTypeOrmModuleOptions({
          DATABASE_URL: config.get('DATABASE_URL', { infer: true }),
        }),
    }),
  ],
})
export class DatabaseModule {}
