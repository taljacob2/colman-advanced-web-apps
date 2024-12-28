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
            outputDirectory: 'tests/reports',
            outputName: 'junit.xml'
        }]
    ],
    coverageDirectory: '../../tests/reports/coverage',
    coverageReporters: [['text', { skipFull: true }], 'html', 'cobertura']
};
