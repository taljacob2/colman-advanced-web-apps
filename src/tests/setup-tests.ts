import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import mongoose from 'mongoose';
dotenvExpand.expand(dotenv.config());



/*
 * Each `__tests__/*.test.js` file is called a test "Suite".
 * This file configures each test suite.
 *
 * - The `global.beforeAll` function configures a global hook to run when a
 *   suite is being initialzed, and is about to begin running its tests.
 * - The `global.afterAll` function configures a global hook to run when a
 *   suite has finished running all of its tests, and is about to close itself.
 */


// Configure environment variables, and allow expand.
dotenvExpand.expand(dotenv.config());


/**
 * Before each test suite:
 *
 * - Generate a new db name.
 * - Connect to the database.
 */
global.beforeAll(() => {
    const DBNAME = process.env.DB_CONNECTION.split('/')[3].split('?')[0];
    const newDBNAME = "tests";

    const dbConnectionUntilDBNAME =
    process.env.DB_CONNECTION.substring(0, process.env.DB_CONNECTION.indexOf(DBNAME));
    const dbConnectionAfterDBNAME =
    process.env.DB_CONNECTION.substring(process.env.DB_CONNECTION.indexOf(DBNAME) + DBNAME.length);
    const newDbConnection = dbConnectionUntilDBNAME + newDBNAME + dbConnectionAfterDBNAME;
    process.env.DB_CONNECTION = newDbConnection;

    console.log(`Connecting to ${process.env.DB_CONNECTION}`)
    mongoose.connect(process.env.DB_CONNECTION)
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log("Connected to DataBase"));
});

/**
 * After each test suite:
 *
 * - Drop the database.
 * - Close the connection to the database.
 */
global.afterAll(async () => {
    console.log("Dropping DB...");
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
