# colman-advanced-web-apps-ex1

## `.env`

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
