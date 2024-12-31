import request from 'supertest';
import app from '../app';




type UserInfo = {
    email: string;
    password: string;
    token?: string;
    _id?: string;
}
const userInfo:UserInfo = {
    email: "berrebimevo@gmail.com",
    password: "123456"
}


describe('Auth Test', () => {
    test('Auth Registragtion', async () => {
        const response = await request(app).post('/auth/register').send(userInfo);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
    });

    test('Auth Login', async () => {
        const response = await request(app).post('/auth/login').send(userInfo);
        expect(response.statusCode).toBe(200);
        const token = response.body.token;
        expect(token).toBeDefined();
        const userId = response.body._id;
        expect(userId).toBeDefined();
        userInfo.token = token;
        userInfo._id = userId;
    });

    test('Get proyected API', async () => {
        const response = await request(app).post('/post').send({
            sender: userInfo._id,
            title: "My First Post",
            content: "This is my First Posts"
        });
        expect(response.statusCode).not.toBe(201);

        const response2 = await request(app).post('/post').set({
            authorization: "jwt " + userInfo.token
        }).send({
            sender: userInfo._id,
            title: "My First Post",
            content: "This is my First Posts"
        });
        expect(response2.statusCode).toBe(201);
    });
    
});