/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  testMatch: ["**/tests/**/*.test.ts"],
  moduleNameMapper: {
    "^@game-tracker/shared$": "<rootDir>/../../packages/shared/src/index.ts",
    "^@game-tracker/domain$": "<rootDir>/../../packages/domain/src/index.ts",
  },
};
