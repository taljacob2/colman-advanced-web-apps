
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    refreshTokens: {
        type: [String],
        default: [] // refresh tokens per user
    }
}, {
    versionKey: false,
});

const UserModel = mongoose.model('Users', userSchema);

export default UserModel;