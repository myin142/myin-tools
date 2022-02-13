module.exports = {
    name: 'aws-cdk-e2e',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/e2e/aws-cdk-e2e',
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.spec.json',
        },
    },
};
