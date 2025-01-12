import type { Config } from "jest";

const config: Config = {
  bail: true,
  clearMocks: true,
  testEnvironment: "node",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // equivalent to the tsconfig file "paths" property
  },
};

export default config;
