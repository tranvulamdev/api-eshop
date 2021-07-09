const mongoose = require('mongoose')

const { Schema } = mongoose

const Category = new Schema({
    name: { type: String, required: true },
    color: { type: String },
    icon: { type: String },
})

// create field id base on _id with value = _id value
Category.virtual('id').get(function () {
    return this._id.toHexString()
})

Category.set('toJSON', { virtuals: true })

exports.Category = mongoose.model('Category', Category)
