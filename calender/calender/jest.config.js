module.exports = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
      customExportConditions: [''],
    },
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    },
  };