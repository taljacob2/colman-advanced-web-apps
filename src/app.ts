import express from 'express';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import bodyParser from 'body-parser';
import posts_routes from './routes/posts_routes';
import comments_routes from './routes/comments_routes';


dotenvExpand.expand(dotenv.config());
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handler for invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send('Invalid JSON syntax');
    }
    next(err);
});


app.use('/post', posts_routes);	
app.use('/comment', comments_routes);	

export default app;
