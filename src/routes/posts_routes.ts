
import express from 'express';
import Post from '../controllers/posts_controller';
import  {authMiddleware} from '../controllers/auth_controller';

const router = express.Router();

router.get('/', Post.getAllPosts);

router.post('/',authMiddleware, (req,res) => {
    Post.createPost(req,res);
});

router.get('/:id', Post.getPostById);

router.put('/:id',authMiddleware, (req,res) => {
    Post.updatePostById(req,res);
});

export default router;