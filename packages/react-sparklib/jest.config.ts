/* eslint-disable */
export default {
  displayName: 'react-sparklib',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {
        presets: [
          '@nx/react/babel',
          ['@babel/preset-env', { loose: true }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/react-sparklib',
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
