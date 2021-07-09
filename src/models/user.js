const mongoose = require('mongoose')

const { Schema } = mongoose

const User = new Schema({
    name: { type: String },
    image: { type: String },
    countInStock: { type: Number, required: true },
})

// create field id base on _id with value = _id value
User.virtual('id').get(function () {
    return this._id.toHexString()
})

User.set('toJSON', { virtuals: true })
exports.User = mongoose.model('User', User)
