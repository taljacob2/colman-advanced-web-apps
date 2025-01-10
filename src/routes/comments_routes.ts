
import express from 'express';
import Comment from '../controllers/comments_controller';
import  {authMiddleware} from '../controllers/auth_controller';


const router = express.Router();

router.post('/', authMiddleware ,Comment.createComment);

router.put('/:id', authMiddleware,Comment.updateCommentById);

router.get('/post/:postId', Comment.getByPostId);

router.delete('/:id',authMiddleware, Comment.deleteCommentById);

router.get('/', Comment.getAllComments);


export default router;