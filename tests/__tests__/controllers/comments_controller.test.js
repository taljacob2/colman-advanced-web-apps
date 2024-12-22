const request = require('supertest');
const app = require('../../../app');

let existingPost1 = null;
let existingPost2 = null;
let existingComment = null;

describe('given db empty of comments when http request GET /comment', () => {
    it('then should return empty list', async () => {
        const res = await request(app).get('/comment');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

/**
 * Already tested in posts_controller.
 * We need this just for initializing `existingPost`.
 */
describe('when http request POST /post', () => {
    it('then should add post to the db', async () => {
        // Post 1
        const body1 = {
            "sender": "USERNAME1",
            "title": "POST1 TITLE",
            "content": "POST1 CONTENT"
        };
        const res1 = await request(app).post('/post')
            .send(body1);
        const resBody1 = res1.body;
        existingPost1 = { ...resBody1 };

        // Post 2
        const body2 = {
            "sender": "USERNAME1",
            "title": "POST2 TITLE",
            "content": "POST2 CONTENT"
        };
        const res2 = await request(app).post('/post')
            .send(body2);
        const resBody2 = res2.body;
        existingPost2 = { ...resBody2 };
    });
});

describe('when http request POST /comment to an unknown post', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": "UNKNOWN",
            "sender": "USERNAME1",
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app).post('/comment')
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request POST /comment to an existing post without required sender field', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": `${existingPost1._id}`,
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app).post('/comment')
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request POST /comment without required postId field', () => {
    it('then should return 404 not found http status', async () => {
        const body = {
            "sender": "USERNAME1",
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app).post('/comment')
            .send(body);

        expect(res.statusCode).toBe(404);
    });
});

describe('when http request POST /comment  to an existing post', () => {
    it('then should add comment to the db', async () => {
        const body = {
            "postId": `${existingPost1._id}`,
            "sender": "USERNAME1",
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app).post('/comment')
            .send(body);
        const resBody = res.body;
        existingComment = { ...resBody };
        delete resBody._id;
        delete resBody.createdAt;
        delete resBody.updatedAt;

        expect(res.statusCode).toBe(201);
        expect(resBody).toEqual(body);
    });
});

/**
 * Already tested this.
 * We need this just for initializing some more comments.
 */
describe('when http request POST /comment  to an existing post', () => {
    it('then should add comment to the db', async () => {
        // Comment 1
        const body1 = {
            "postId": `${existingPost1._id}`,
            "sender": "USERNAME1",
            "content": "COMMENT1 CONTENT"
        };
        await request(app).post('/comment').send(body1);

        // Comment 2
        const body2 = {
            "postId": `${existingPost1._id}`,
            "sender": "USERNAME2",
            "content": "COMMENT2 CONTENT"
        };
        await request(app).post('/comment').send(body2);

        // Comment 3
        const body3 = {
            "postId": `${existingPost1._id}`,
            "sender": "USERNAME3",
            "content": "COMMENT3 CONTENT"
        };
        await request(app).post('/comment').send(body3);
    });
});

describe('given db initialized with comments when http request GET /comment', () => {
    it('then should return all coments in the db', async () => {
        const res = await request(app).get('/comment');
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toEqual([]);
    });
});

describe('when http request PUT /comment/id of unknown post', () => {
    it('then should return 201 created http status', async () => {
        const body = {
            "postId": "UNKNOWN",
            "sender": "UPDATED USERNAME",
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/${existingComment._id}`)
            .send(body);
        const resBody = res.body;

        expect(res.statusCode).toBe(201);
        expect(new Date(resBody.updatedAt).getMilliseconds())
            .toBeGreaterThan(new Date(resBody.createdAt).getMilliseconds());
        delete resBody._id;
        delete resBody.createdAt;
        delete resBody.updatedAt;
        expect(resBody.postId).toEqual(existingPost1._id);
    });
});

describe('when http request PUT /comment/id of unknown comment', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": `${existingPost1._id}`,
            "sender": "UPDATED USERNAME",
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/UNKNOWN`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request PUT /comment/id without required postId field', () => {
    it('then should return 201 created http status', async () => {
        const body = {
            "sender": "UPDATED USERNAME",
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/${existingComment._id}`)
            .send(body);
        const resBody = res.body;

        expect(res.statusCode).toBe(201);
        expect(new Date(resBody.updatedAt).getMilliseconds())
            .toBeGreaterThan(new Date(resBody.createdAt).getMilliseconds());
        delete resBody._id;
        delete resBody.createdAt;
        delete resBody.updatedAt;
        expect(resBody.postId).toEqual(existingPost1._id);
    });
});

describe('when http request PUT /comment/id without required sender field', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": `${existingPost1._id}`,
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/${existingComment._id}`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request PUT /comment/id of existing post and comment', () => {
    it('then should update comment in the db', async () => {
        const body = {
            "postId": `${existingPost1._id}`,
            "sender": "UPDATED USERNAME",
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/${existingComment._id}`)
            .send(body);
        const resBody = res.body;

        expect(res.statusCode).toBe(201);
        expect(new Date(resBody.updatedAt).getMilliseconds())
            .toBeGreaterThan(new Date(resBody.createdAt).getMilliseconds());
        delete resBody._id;
        delete resBody.createdAt;
        delete resBody.updatedAt;    
        expect(resBody).toEqual(body);
    });
});

describe('given existing post when http request GET /comment/post/id', () => {
    it('then should return its comments only', async () => {
        const res = await request(app).get(`/comment/post/${existingPost1._id}`);
        const resBody = res.body;
        const postIds = resBody.map((comment) => comment.postId);

        // Use filter and return array with unique values
        const uniquePostIds = postIds.filter(
            (e, i, self) => i === self.indexOf(e));

        expect(res.statusCode).toBe(200);
        expect(uniquePostIds.length).toBe(1);
        expect(uniquePostIds[0]).toEqual(resBody[0].postId);
    });
});

describe('given unknown post when http request GET /comment/post/id', () => {
    it('then should return 400 bad request http status', async () => {
        const res = await request(app).get(`/comment/post/UNKNOWN`);
    
        expect(res.statusCode).toBe(400);
    });
});

describe('given existing post without any comments when http request GET /comment/post/id', () => {
    it('then should return empty list', async () => {
        const res = await request(app)
            .get(`/comment/post/${existingPost2._id}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('given unknown comment when http request DELETE /comment/id', () => {
    it('then should return 400 bad request http status', async () => {
        const res = await request(app).delete(`/comment/UNKNOWN`);

        expect(res.statusCode).toBe(400);
    });
});

describe('given existing comment when http request DELETE /comment/id', () => {
    it('then should return 200 success http status', async () => {
        const res = await request(app)
            .delete(`/comment/${existingComment._id}`);

        expect(res.statusCode).toBe(200);
    });
});
