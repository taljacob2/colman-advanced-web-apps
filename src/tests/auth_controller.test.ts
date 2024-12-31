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
const userInfo2:UserInfo = {
    email: "berrebimevo@hotmail.fr",
    password: "555555"
}

type PostInfo = {
    sender: string;
    title: string;
    content: string;
    _id?: string;
}


const existingPost: PostInfo = {
    sender: "MEVORAH",
    title: "My First Post",
    content: "This is my First Posts"
}
const commentBody = {
    postId: existingPost._id,
    sender: "USERNAME1",
    content: "COMMENT1 CONTENT"
};
describe('Auth Post Test', () => {
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
    test('Get proyected API when trying to Create Post', async () => {
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

describe('Auth Comment Test', () => {

    test("Auth Registragtion Comment's user", async () => {
        const response = await request(app).post('/auth/register').send(userInfo2);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
    });
    test("Auth Login Comment's user", async () => {
        const response = await request(app).post('/auth/login').send(userInfo2);
        expect(response.statusCode).toBe(200);
        const token = response.body.token;
        expect(token).toBeDefined();
        const userId = response.body._id;
        expect(userId).toBeDefined();
        userInfo2.token = token;
        userInfo2._id = userId;
    });
    test('Get proyected API when trying to Create Comment', async () => {
        const tempPost= await request(app).post('/post').set({
            authorization: "jwt " + userInfo.token
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
            authorization: "jwt " + userInfo2.token
        }).send({
            postId: tempPost.body._id,
            sender: userInfo2._id,
            content: "This is my First Posts"
        });
        expect(response2.statusCode).toBe(201);
    });
    
});
