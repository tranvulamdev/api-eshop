const mongoose = require('mongoose')

const { Schema } = mongoose

const Order = new Schema({
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem',
            required: true,
        },
    ],
    shippingAddress1: { type: String, required: true },
    shippingAddress2: { type: String },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, required: true, default: 'Pending' },
    totalPrice: { type: Number },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dateOrdered: { type: Date, default: Date.now },
})

// create field id base on _id with value = _id value
Order.virtual('id').get(function () {
    return this._id.toHexString()
})
Order.set('toJSON', { virtuals: true })

exports.Order = mongoose.model('Order', Order)
