module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/test/**/*.test.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/types/**/*.ts',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/src/hooks.ts'],
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
};
