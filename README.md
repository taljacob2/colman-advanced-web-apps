# colman-advanced-web-apps-ex1

## `.env`

As a **requirement** for running the application, create an `.env` file in the root working directory and define the environment variables there.

See [`.env.template`](.env.template) for all the environment variables required.

### `PORT`

The port number to serve the node server on when executing the `npm run dev` or `npm start` commands.

For example `3000`.

### `DB_CONNECTION`

The connection string to the mongodb database.

### `ACCESS_TOKEN_SECRET`

To generate a secret key for access and refresh token, execite this command in your terminal:

```
openssl rand -out openssl-secret.txt -hex 64
```

The secret will be stored in the `openssl-secret.txt` file.

Navigate to the `.env` file and set the `ACCESS_TOKEN_SECRET` variable to that token value.

### `TOKEN_EXPIRATION`

Determines the expiration time for the authentication token.

It is composed of `<NUMBER><TIME_UNIT>`.

for example:

- `30s` - is 30 seconds
- `30m` -  is 30 minutes
- `30h` - is 30 hours

You can set the NUMBER and the TIME_UNIT to your liking.

### `REFRESH_TOKEN_SECRET`

You should define it in the same way as [`ACCESS_TOKEN_SECRET`](https://github.com/taljacob2/colman-advanced-web-apps?tab=readme-ov-file#access_token_secret).

### `REFRESH_TOKEN_EXPIRATION`

Determines the expiration time for the authentication refresh token.

You should define it in the same way as [`TOKEN_EXPIRATION`](https://github.com/taljacob2/colman-advanced-web-apps?tab=readme-ov-file#token_expiration).

## Usage

Install the required node packages:

```
npm i
```

Start the appliation:

```
npm start
```

### Development

Run the application with nodemon:

```
npm run dev
```

Run tests:

```
npm run test
```

See our `master` test coverage at https://taljacob2.github.io/colman-advanced-web-apps
