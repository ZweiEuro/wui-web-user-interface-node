import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  rootDir: '..',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/node_modules/',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/src/replayTool/replayTool.ts'],
  clearMocks: true,
  collectCoverage: true,
  bail: true,
  coverageReporters: ['text'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: '<rootDir>/buildConfigs/tsconfig.common.json' },
    ],
  },
  maxWorkers: 20,
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transformIgnorePatterns: ['/node_modules/'],
};

export default config;
