
import express from 'express';
import Comment from '../controllers/comments_controller';


const router = express.Router();

router.post('/', Comment.createComment);

router.put('/:id', Comment.updateCommentById);

router.get('/post/:postId', Comment.getByPostId);

router.delete('/:id', Comment.deleteCommentById);

router.get('/', Comment.getAllComments);


export default router;