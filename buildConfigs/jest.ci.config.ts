import type { Config } from 'jest';
import sharedConfig from './jest.config';

const config: Config = {
  ...sharedConfig,
  ci: true,
  coverageDirectory: './coverage',
  reporters: ['default', 'jest-junit'],
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'cobertura'],
};

export default config;
