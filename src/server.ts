import app from './app';
import mongoose from 'mongoose';


// Start app while verifying connection to the database.
const port = process.env.PORT;
app.listen(port, () => {    
    mongoose.connect(process.env.DB_CONNECTION)
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log("Connected to DataBase"));
    console.log(`Example app listening at http://localhost:${port}`);
});
