import postModel from '../models/posts_model';
import commentModel from '../models/comments_model';

const createComment = async (req, res) => {
    const comment = req.body;
    try {
        const post = await postModel.findById(comment.postId);
        if (post == null) {
            res.status(404).send('Post not found');
        } else {
            const utcNow = new Date().toISOString();
            comment.createdAt = utcNow;
            comment.updatedAt = utcNow;
            const newComment = await commentModel.create(comment);
            res.status(201).send(newComment);
        }
    } catch(error) {
        res.status(400).send("Bad Request");
    }
}

const updateCommentById = async (req, res) => {
    const id = req.params.id;
    const comment = req.body;
    try {
        const oldComment = await commentModel.findById(id);
        if (oldComment == null) {
            res.status(404).send('Comment not found');
        } else {
            comment.postId = oldComment.postId;
            comment.updatedAt = new Date().toISOString();
            comment.createdAt = oldComment.createdAt;
            await new commentModel(comment).validate();
            await commentModel.findByIdAndUpdate(id, comment);

            comment._id = oldComment._id;
            res.status(201).send(comment);
        }
    } catch(error) {
        res.status(400).send("Bad Request");
    }
}

const getByPostId = async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await postModel.findById(postId);
        if (post == null) {
            res.status(404).send('Post not found');
        } else {
            const comments = await commentModel.find({ postId: post._id });
            res.status(200).send(comments);
        }
    } catch(error) {
        res.status(400).send("Bad Request");
    }
}

const deleteCommentById = async (req, res) => {
    const id = req.params.id;
    try {
        const comment = await commentModel.findById(id);
        if (comment == null) {
            res.status(404).send('Comment not found');
        } else {
            const deletedComment = await commentModel.findByIdAndDelete(id);
            res.status(200).send(deletedComment);
        }
    } catch(error) {
        res.status(400).send("Bad Request");
    }
}

const getAllComments = async (req, res) => {
    try {
        const comments = await commentModel.find();
        res.status(200).send(comments);
    } catch(error) {
        res.status(400).send("Bad Request");
    }
}

export default {createComment, getByPostId, updateCommentById, deleteCommentById, getAllComments};
