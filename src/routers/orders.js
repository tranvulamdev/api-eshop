const express = require('express')
const router = express.Router()
const { Order } = require('../models/order')
const { OrderItem } = require('../models/orderItem')

// [GET] /orders
router.get('/', async (req, res) => {
    const orderList = await Order.find({})
        .populate('user', 'name')
        .sort({ dateOrdered: -1 })

    if (!orderList) return res.status(500).json({ success: false })

    res.send(orderList)
})

// [GET] /orders/:id
router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name price category',
                populate: { path: 'category', select: 'name' },
            },
        })

    if (!order) return res.status(500).json({ success: false })

    res.send(order)
})

// [POST] /categories
router.post('/', async (req, res) => {
    const orderItemIds = Promise.all(
        req.body.orderItems.map(async orderItem => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product,
            })

            newOrderItem = await newOrderItem.save()

            return newOrderItem._id
        })
    )
    // trong map co async => neu co 2 item => tra ve [2 promise<pending>]
    // => dung Promise.all() de tra ve chi 1 promise<pending>
    // await => tra ve [cac id]
    const orderItemIdsResolved = await orderItemIds

    const totalPrices = await Promise.all(
        orderItemIdsResolved.map(async orderItemId => {
            const orderItem = await OrderItem.findById(orderItemId).populate(
                'product',
                'price'
            )

            const totalPrice = orderItem.product.price * orderItem.quantity

            return totalPrice
        })
    )

    const totalPrice = totalPrices.reduce((acc, cur) => acc + cur, 0)

    let order = new Order({
        orderItems: orderItemIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    order = await order.save()

    if (!order) return res.status(400).send('the order cannot be created!')
    res.send(order)
})

// [PUT] /orders/:id
router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        { new: true }
    )

    if (!order) return res.status(500).send('the order cannot be updated!')
    res.send(order)
})

// DELETE] /orders/:id
router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id)
        .then(async order => {
            if (order) {
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findByIdAndRemove(orderItem)
                })
                return res
                    .status(200)
                    .json({ success: true, message: 'the order is deleted!' })
            } else
                return res
                    .status(404)
                    .json({ success: false, message: 'order not found' })
        })
        .catch(err => res.status(500).json({ success: false, error: err }))
})

// [GET] /orders/get/total-sales
router.get('/get/total-sales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ])

    if (!totalSales)
        return res.status(400).send('The order sales cannot be generated')
    res.send({ totalSales: totalSales.pop().totalSales })
})

// [GET] /orders/get/count
router.get('/get/count', async (req, res) => {
    const orderCount = await Order.estimatedDocumentCount()

    if (!orderCount) return res.status(500).json({ success: false })
    res.send({ orderCount })
})

// [GET] /orders/get/user-orders/:userId
router.get('/get/user-orders/:userId', async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userId })
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name price category',
                populate: { path: 'category', select: 'name' },
            },
        })
        .sort({ dateOrdered: -1 })

    if (!userOrderList) return res.status(500).json({ success: false })

    res.send(userOrderList)
})

module.exports = router
