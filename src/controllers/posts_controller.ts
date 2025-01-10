import postModel from '../models/posts_model';

const getAllPosts =  async (req, res) => {
    const senderFilter = req.query.sender;
    try{
        if(senderFilter){
            const posts = await postModel.find({sender: senderFilter});
            res.status(200).send(posts);
            
        } else{
            const posts = await postModel.find();
            res.status(200).send(posts);
        }
    } catch(error){
        res.status(400).send("Bad Request");
    }

}

const createPost = async (req, res) => {
    const post = req.body;
    try{
        const newPost = await postModel.create(post);
        res.status(201).send(newPost);

    }catch(error){
        res.status(400).send("Bad Request");

    }
}

const getPostById = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        return res.status(200).send(post);
    } catch(error) {
        return res.status(400).send("Bad Request");
    }
}

const updatePostById = async (req, res) => {
    const id = req.params.id;
    const post = req.body;
    try {
        await new postModel(post).validate();
        const oldPost = await postModel.findByIdAndUpdate(id, post);
        if (oldPost == null) {
            res.status(404).send('Post not found');
        } else {
            post._id = oldPost._id;
            res.status(201).send(post);
        }        
    } catch(error) {
        res.status(400).send("Bad Request");
    }
}

export default {getAllPosts, createPost, getPostById, updatePostById};
