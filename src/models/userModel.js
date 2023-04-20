const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, lowercase: true, trim: true, },
        email: { type: String, required: true, lowercase: true, trim: true, },
        password: { type: String, required: true },
        phone: { type: String, trim: true, },
        address: { type: String, trim: true, },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        avatar: { type: String },
        posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
        tokens: [{
            token: {
                type: String,
                required: true
            },
            isRevoked: {
                type: Boolean,
                default: false
            }
        }],
    },
    {
        timestamps: true,
    }
)


userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const User = mongoose.model('User', userSchema);

module.exports = User;
