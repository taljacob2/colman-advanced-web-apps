
const express = require('express');
const router = express.Router();
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand(dotenv.config());
const app = express();
const port = process.env.PORT;

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION)
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to DataBase"));

app.use(express.json());

// Error handler for invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send('Invalid JSON syntax');
    }
    next(err);
});

const posts_routes = require('./routes/posts_routes');
app.use('/post', posts_routes);	
const comments_routes = require('./routes/comments_routes');
app.use('/comment', comments_routes);	

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


