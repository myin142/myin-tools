/* eslint-disable */
export default {
    preset: '../../jest.preset.js',
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
    coverageDirectory: '../../coverage/packages/aws-cdk',
    displayName: 'aws-cdk',
    testEnvironment: 'node',
};
