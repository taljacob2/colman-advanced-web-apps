
import express from 'express';
import Post from '../controllers/posts_controller';

const router = express.Router();

router.get('/', Post.getAllPosts);

router.post('/', Post.createPost);

router.get('/:id', Post.getPostById);

router.put('/:id', Post.updatePostById);

export default router;