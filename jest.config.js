module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/files/', '/__tests__/helpers/', '/test/'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
