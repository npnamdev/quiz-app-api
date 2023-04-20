const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        slug: { type: String },
        posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }]
    },
    {
        timestamps: true,
    }
)


categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
