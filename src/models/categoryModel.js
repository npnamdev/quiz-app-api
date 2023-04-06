const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }]
    },
    {
        timestamps: true,
    }
)


CategorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Category = mongoose.model('Category  ', CategorySchema);

module.exports = Category;
