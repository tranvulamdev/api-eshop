const express = require('express')
const router = express.Router()
const { Order } = require('../models/order')

router.get('/', (req, res) => {
    Order.find({})
        .then(orders => res.status(200).json(orders))
        .catch(() => res.status(500).json({ success: false }))
})

router.post('/', (req, res) => {
    const order = new Order({ ...req.body })
    order
        .save()
        .then(() => res.status(201).json(order))
        .catch(err => res.status(500).json({ error: err, success: false }))
})

module.exports = router
