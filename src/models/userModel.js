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


//Mã hóa password khi Tạo Mới Người dùng
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


//Mã hóa password khi Chỉnh Sửa Người dùng
userSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update.password) {
        this._update.password = await bcrypt.hash(this._update.password, 10);
    }
    next();
});


userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const User = mongoose.model('User', userSchema);

module.exports = User;
