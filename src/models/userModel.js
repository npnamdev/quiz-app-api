const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, lowercase: true },
        email: { type: String, required: true, lowercase: true },
        password: { type: String, required: true },
        phone: { type: String },
        address: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        avatar: { type: String },
        posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }]
    },
    {
        timestamps: true,
    }
)


userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const User = mongoose.model('User', userSchema);

module.exports = User;
