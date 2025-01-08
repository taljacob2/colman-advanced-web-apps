import request from 'supertest';
import app from '../app';

type UserInfo = {
    email: string;
    password: string;
    accessToken?: string;
    refreshToken?: string; //token for every log in, for each device login
    _id?: string;
}
const userInfo: UserInfo = {
    email: "berrebimevo@gmail.com",
    password: "123456"
}
const userInfo2: UserInfo = {
    email: "berrebimevo@hotmail.fr",
    password: "555555"
}



describe('Auth Post Test', () => {
    test('Auth Registragtion', async () => {
        const response = await request(app).post('/auth/register').send(userInfo);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
    });
    test('Auth Login', async () => {
        const response = await request(app).post('/auth/login').send(userInfo);
        expect(response.statusCode).toBe(200);

        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        const userId = response.body._id;

        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
        expect(userId).toBeDefined();

        userInfo.accessToken = accessToken;
        userInfo.refreshToken = refreshToken;
        userInfo._id = userId;
    });

    test("Make sure two access tokens are not equal", async () => {
        const response = await request(app).post('/auth/login').send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.body.accessToken).not.toBe(userInfo.accessToken);
    });

    test('Get proyected API when trying to Create Post', async () => {
        const response = await request(app).post('/post').send({
            sender: "Invalid Owner",
            title: "My First Post",
            content: "This is my First Posts"
        });
        expect(response.statusCode).not.toBe(201);

        const response2 = await request(app).post('/post').set({
            authorization: "jwt " + userInfo.accessToken
        }).send({
            sender: userInfo._id,
            title: "My First Post",
            content: "This is my First Posts"
        });
        expect(response2.statusCode).toBe(201);
    });
});

describe('Auth Comment Test', () => {
    test("Auth Registragtion Comment's user", async () => {
        const response = await request(app).post('/auth/register').send(userInfo2);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
    });
    test("Auth Login Comment's user", async () => {
        const response = await request(app).post('/auth/login').send(userInfo2);
        expect(response.statusCode).toBe(200);

        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        const userId = response.body._id;

        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
        expect(userId).toBeDefined();
        userInfo2.accessToken = accessToken;
        userInfo2.refreshToken = refreshToken;
        userInfo2._id = userId;
    });
    test('Get proyected API when trying to Create Comment', async () => {
        const tempPost = await request(app).post('/post').set({
            authorization: "jwt " + userInfo.accessToken
        }).send({
            sender: userInfo._id,
            title: "My First Post",
            content: "This is my First Posts"
        });
        expect(tempPost.statusCode).toBe(201);

        const response = await request(app).post('/comment').send({
            postId: tempPost.body._id,
            sender: userInfo2._id,
            content: "This is my First Posts"
        });
        expect(response.statusCode).not.toBe(201);

        const response2 = await request(app).post('/comment').set({
            authorization: "jwt " + userInfo2.accessToken
        }).send({
            postId: tempPost.body._id,
            sender: userInfo2._id,
            content: "This is my First Posts"
        });
        expect(response2.statusCode).toBe(201);
    });
});

describe('Auth Invalid & Refresh tokens Tests', () => {
    beforeAll(() => {
        process.env.TOKEN_EXPIRATION = '3s';
        process.env.REFRESH_TOKEN_EXPIRATION = '7d';
    });

    test('Get proyected API invalid token', async () => {
        const response = await request(app).post('/post').set({
            authorization: "jwt " + userInfo.accessToken + '1'
        }).send({
            sender: userInfo._id,
            title: "My First Post",
            content: "This is my First Posts"
        });
        expect(response.statusCode).not.toBe(201);
    });

    const refreshTokenTest = async () => {

        const response = await request(app).post('/auth/refresh').send({
            refreshToken: userInfo.refreshToken

        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.accessToken = response.body.accessToken;
        userInfo.refreshToken = response.body.refreshToken;
    }
    test("Refresh token", async () => {
        refreshTokenTest();
    });
    test("Refresh token", async () => {
        refreshTokenTest();
    });

    test("Logout - Invalid refresh token", async () => {
        const response = await request(app).post('/auth/logout').send({
            refreshToken: userInfo.refreshToken
        });
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).post('/auth/refresh').send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).not.toBe(200);
    });

    test("refresh token multiple usage", async () => {
        //login - get a Refresh token
        const response = await request(app).post('/auth/login').send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.statusCode).toBe(200);
        userInfo.accessToken = response.body.accessToken
        userInfo.refreshToken = response.body.refreshToken

        // first time use the refresh token and get a new one
        const response2 = await request(app).post('/auth/refresh').send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).toBe(200);

        const newRefreshToken = response2.body.refreshToken;

        // second time use the old refresh token and expect to fail
        const response3 = await request(app).post('/auth/refresh').send({
            refreshToken: userInfo.refreshToken
        });
        expect(response3.statusCode).not.toBe(200);

        // try to use the new refresh token and expect to
        const response4 = await request(app).post('/auth/refresh').send({
            refreshToken: newRefreshToken
        });
        expect(response4.statusCode).not.toBe(200);
    });

    jest.setTimeout(10000);
    test("timeout on refresh access token", async () => {
        const response = await request(app).post('/auth/login').send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.accessToken = response.body.accessToken
        userInfo.refreshToken = response.body.refreshToken

        // wait 6 seconds
        await new Promise(resolve => setTimeout(resolve, 6000));

        //try to access with expired token
        const response2 = await request(app).post('/post').set({
            authorization: "jwt " + userInfo.accessToken
        }).send({
            sender: "Invalid owner",
            title: "My First Post",
            content: "This is my First Posts"
        });
        expect(response2.statusCode).not.toBe(201);

        const response3 = await request(app).post('/auth/refresh').send({
            refreshToken: userInfo.refreshToken
        });
        expect(response3.statusCode).toBe(200);
        userInfo.accessToken = response3.body.accessToken;
        userInfo.refreshToken = response3.body.refreshToken;

        const response4 = await request(app).post('/post').set({
            authorization: "jwt " + userInfo.accessToken
        }).send({
            sender: "Invalid owner",
            title: "My First Post",
            content: "This is my First Posts"
        });
        expect(response4.statusCode).toBe(201);
    });



});

