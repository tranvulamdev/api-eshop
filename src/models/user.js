const mongoose = require('mongoose')

const { Schema } = mongoose

const User = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    street: { type: String, default: '' },
    apartment: { type: String, default: '' },
    zip: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
})

// create field id base on _id with value = _id value
User.virtual('id').get(function () {
    return this._id.toHexString()
})

User.set('toJSON', { virtuals: true })
exports.User = mongoose.model('User', User)
