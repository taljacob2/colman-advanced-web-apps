
import express from 'express';
import Post from '../controllers/posts_controller';
import  {authMiddleware} from '../controllers/auth_controller';

const router = express.Router();

router.get('/', Post.getAllPosts);

router.post('/', authMiddleware, Post.createPost);

router.get('/:id', Post.getPostById);

router.put('/:id', authMiddleware, Post.updatePostById);

export default router;