const config = {
  preset: 'ts-jest',
  "transform": {
    "^.+\\.ts?$": "ts-jest"
  },
  "testRegex": "^.+\\.test\\.ts$",
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = config;