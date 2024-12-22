// eslint-disable-next-line import/no-commonjs
module.exports = {
    testTimeout: 10 * 1000,
    roots: ['../'],
    passWithNoTests: true,
    setupFilesAfterEnv: ['./setup-tests.js'],
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: ['../**/*.js', '!../../node_modules/**'],
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: 'tests/reports',
            outputName: 'junit.xml'
        }]
    ],
    coverageDirectory: '../../tests/reports/coverage',
    coverageReporters: [['text', { skipFull: true }], 'html', 'cobertura']
};
