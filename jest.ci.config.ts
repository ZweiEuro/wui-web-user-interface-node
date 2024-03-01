import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/test/**/*.test.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/types/**/*.ts',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        //the content you'd placed at "global"
        diagnostics: false,
        isolatedModules: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  ci: true,
  silent: true,
  collectCoverage: true,
  coverageDirectory: './coverage',
  reporters: ['default', 'jest-junit'],
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'cobertura'],
};

export default config;
