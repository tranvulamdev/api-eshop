const mongoose = require('mongoose')

const { Schema } = mongoose

const Order = new Schema({
    name: { type: String },
    image: { type: String },
    countInStock: { type: Number, required: true },
})

// create field id base on _id with value = _id value
Order.virtual('id').get(function () {
    return this._id.toHexString()
})

Order.set('toJSON', { virtuals: true })
exports.Order = mongoose.model('Order', Order)
