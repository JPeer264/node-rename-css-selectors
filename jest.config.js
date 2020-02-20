module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/files/', '/__tests__/helpers/', '/test/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
