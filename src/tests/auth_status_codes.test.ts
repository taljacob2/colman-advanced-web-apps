import request from 'supertest';
import app from '../app';

describe('Authentication Status Code Tests', () => {
    let validAccessToken: string;
    const expiredAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTVmZjJlNzk2ZjY4NDY5OWM5M2Y3ZjYiLCJpYXQiOjE3MDA3NjM4NzksImV4cCI6MTcwMDc2Mzg4MH0.1VroBCccWBUGqwEtQN5QQwo4IpXoP0xYLSQGbZtNeSE';
    let postId: string;
    let commentId: string;

    beforeAll(async () => {
        // Register and login to get valid access token
        const user = {
            email: "test@status.com",
            password: "123456"
        };
        await request(app).post('/auth/register').send(user);
        const loginResponse = await request(app).post('/auth/login').send(user);
        if (loginResponse.status != 200) {
            console.error('login error');
            return;
        }
        validAccessToken = loginResponse.body.accessToken;

        // Create a post for testing
        const postResponse = await request(app)
            .post('/post')
            .set('Authorization', `jwt ${validAccessToken}`)
            .send({
                sender: "TestUser",
                title: "Test Post",
                content: "Test Content"
            });
        postId = postResponse.body._id;

        // Create a comment for testing
        const commentResponse = await request(app)
            .post('/comment')
            .set('Authorization', `jwt ${validAccessToken}`)
            .send({
                postId: postId,
                sender: "TestUser",
                content: "Test Comment"
            });
        commentId = commentResponse.body._id;
    });

    describe('200 Success Status Tests', () => {
        it('should return 200 on successful GET posts', async () => {
            const res = await request(app).get('/post');
            expect(res.status).toBe(200);
        });

        it('should return 200 on successful GET comments', async () => {
            const res = await request(app).get('/comment');
            expect(res.status).toBe(200);
        });

        it('should return 200 on successful comment deletion', async () => {
            const res = await request(app)
                .delete(`/comment/${commentId}`)
                .set('Authorization', `jwt ${validAccessToken}`);
            expect(res.status).toBe(200);
        });
    });

    describe('201 Created Status Tests', () => {
        it('should return 201 on successful post creation', async () => {
            const res = await request(app)
                .post('/post')
                .set('Authorization', `jwt ${validAccessToken}`)
                .send({
                    sender: "TestUser",
                    title: "New Post",
                    content: "New Content"
                });
            expect(res.status).toBe(201);
        });

        it('should return 201 on successful comment creation', async () => {
            const res = await request(app)
                .post('/comment')
                .set('Authorization', `jwt ${validAccessToken}`)
                .send({
                    postId: postId,
                    sender: "TestUser",
                    content: "New Comment"
                });
            expect(res.status).toBe(201);
        });
    });

    describe('400 Bad Request Status Tests', () => {
        it('should return 400 when creating post without required fields', async () => {
            const res = await request(app)
                .post('/post')
                .set('Authorization', `jwt ${validAccessToken}`)
                .send({
                    content: "Missing required fields"
                });
            expect(res.status).toBe(400);
        });

        it('should return 400 when creating comment with invalid post ID', async () => {
            const res = await request(app)
                .post('/comment')
                .set('Authorization', `jwt ${validAccessToken}`)
                .send({
                    postId: "invalid_id",
                    sender: "TestUser",
                    content: "Test Comment"
                });
            expect(res.status).toBe(400);
        });
    });

    describe('401 Unauthorized Status Tests', () => {
        it('should return 401 when creating post without token', async () => {
            const res = await request(app)
                .post('/post')
                .send({
                    sender: "TestUser",
                    title: "Test Post",
                    content: "Test Content"
                });
            expect(res.status).toBe(401);
        });

        it('should return 401 when updating comment without token', async () => {
            const res = await request(app)
                .put(`/comment/${commentId}`)
                .send({
                    sender: "TestUser",
                    content: "Updated Comment"
                });
            expect(res.status).toBe(401);
        });
    });

    describe('403 Forbidden Status Tests', () => {
        it('should return 403 when using expired access token for post creation', async () => {
            const res = await request(app)
                .post('/post')
                .set('Authorization', `jwt ${expiredAccessToken}`)
                .send({
                    sender: "TestUser",
                    title: "Test Post",
                    content: "Test Content"
                });
            expect(res.status).toBe(403);
        });

        it('should return 403 when using expired access token for comment update', async () => {
            const res = await request(app)
                .put(`/comment/${commentId}`)
                .set('Authorization', `jwt ${expiredAccessToken}`)
                .send({
                    sender: "TestUser",
                    content: "Updated Comment"
                });
            expect(res.status).toBe(403);
        });
    });

    describe('404 Not Found Status Tests', () => {
        it('should return 404 when accessing non-existent post', async () => {
            // Use a valid ObjectId format that doesn't exist in the database
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .get(`/post/${nonExistentId}`);
            expect(res.status).toBe(404);
        });

        it('should return 404 when creating comment for non-existent post', async () => {
            // Use a valid ObjectId format that doesn't exist in the database
            const nonExistentId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .post('/comment')
                .set('Authorization', `jwt ${validAccessToken}`)
                .send({
                    postId: nonExistentId,
                    sender: "TestUser",
                    content: "Test Comment"
                });
            expect(res.status).toBe(404);
        });
    });
}); 