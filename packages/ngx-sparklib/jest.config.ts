/* eslint-disable */
export default {
  displayName: 'ngx-sparklib',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/packages/ngx-sparklib',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  moduleNameMapper: {
    '^d3-color$': 'node_modules/d3-color/dist/d3-color.min.js',
    '^d3-format$': 'node_modules/d3-format/dist/d3-format.min.js',
    '^d3-interpolate$':
      'node_modules/d3-interpolate/dist/d3-interpolate.min.js',
    '^d3-path$': 'node_modules/d3-path/dist/d3-path.min.js',
    '^d3-scale$': 'node_modules/d3-scale/dist/d3-scale.min.js',
    '^d3-shape$': 'node_modules/d3-shape/dist/d3-shape.min.js',
    '^d3-time$': 'node_modules/d3-time/dist/d3-time.min.js',
    '^d3-time-format$':
      'node_modules/d3-time-format/dist/d3-time-format.min.js',
  },
};
