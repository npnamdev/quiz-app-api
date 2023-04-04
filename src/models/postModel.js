const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        content: { type: String, required: true },
        image: { type: String },
        author: { type: mongoose.Types.ObjectId, ref: 'User' },
        category: { type: mongoose.Types.ObjectId, ref: 'Category' }
    },
    {
        timestamps: true,
    }
)


postSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
