const mongoose = require('../lib/mongoose')

const Schema = mongoose.Schema;

// 商品类别
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 30
    }
}, {
    collection: 'user',
    toObject: {
        virtuals: true,
        getters: true
    },
    toJSON: {
        virtuals: true,
        getters: true
    }
});

module.exports = mongoose.model('User', userSchema);
