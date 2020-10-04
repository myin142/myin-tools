module.exports = {
    name: 'aws-utils-e2e',
    preset: '../../jest.config.js',
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    coverageDirectory: '../../coverage/e2e/aws-utils-e2e',
};
