const mongoose = require('mongoose')

const { Schema } = mongoose

const OrderItem = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: { type: Number, required: true },
})

// create field id base on _id with value = _id value
OrderItem.virtual('id').get(function () {
    return this._id.toHexString()
})
OrderItem.set('toJSON', { virtuals: true })

exports.OrderItem = mongoose.model('OrderItem', OrderItem)
