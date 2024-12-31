/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    testTimeout: 10 * 1000,
    roots: ["../"],
    passWithNoTests: true,
    setupFilesAfterEnv: ['./setup-tests.ts'],
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: ['../**/*.js', '!../../node_modules/**'],
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: 'tests/reports/junit',
            outputName: 'junit.xml'
        }],
        ['jest-html-reporters', {
            publicPath: 'tests/reports/test-report',
            filename: 'index.html',
            pageTitle: 'Test Report'
        }]
    ],
    coverageDirectory: '../../tests/reports/coverage',
    coverageReporters: [['text', { skipFull: true }], 'html', 'cobertura']
};
