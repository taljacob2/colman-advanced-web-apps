const express = require('express');
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand(dotenv.config());
const swaggerUi = require('swagger-ui-express');
const loadOpenApiFile = require('./openapi/openapi_loader');
const app = express();


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handler for invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send('Invalid JSON syntax');
    }
    next(err);
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(loadOpenApiFile()));
const posts_routes = require('./routes/posts_routes');
app.use('/post', posts_routes);	
const comments_routes = require('./routes/comments_routes');
app.use('/comment', comments_routes);

module.exports = app;
