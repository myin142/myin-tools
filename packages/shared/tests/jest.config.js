module.exports = {
    preset: '../../../jest.preset.js',
    globals: {
        'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
    },
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
    coverageDirectory: '../../../coverage/packages/shared/tests',
    displayName: 'shared-tests',
};
