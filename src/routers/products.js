const express = require('express')
const router = express.Router()
const { Product } = require('../models/product')
const { Category } = require('../models/category')
const mongoose = require('mongoose')

// [GET] /products[?categories]
router.get('/', async (req, res) => {
    let filters = {}
    if (req.query.categories)
        filters = { category: req.query.categories.split(',') }
    // select: chi hien thi cac field minh muon, populate: hien thi field cua category
    const productList = await Product.find(filters).populate('category')
    // .select('name image -_id')

    if (!productList) return res.status(500).json({ success: false })
    res.send(productList)
})

// [GET] /products/:id
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')

    if (!product) return res.status(500).json({ success: false })
    res.send(product)
})

// [POST] /products
router.post('/', async (req, res) => {
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid category')

    let product = new Product({ ...req.body })
    product = await product.save()

    if (!product) return res.status(500).send('the product cannot be created')
    res.send(product)
})

// [PUT] /products/:id
router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id))
        return res.status(400).send('Invalid Product ID')

    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )

    if (!product) return res.status(500).send('the product cannot be updated!')
    res.send(product)
})

// [DELETE] /products/:id
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if (product)
                res.status(200).json({
                    success: true,
                    message: 'the product is deleted!',
                })
            else
                res.status(404).json({
                    success: false,
                    message: 'product not found!',
                })
        })
        .catch(err => res.status(500).json({ success: false, error: err }))
})

// [GET] /products/get/count
router.get('/get/count', async (req, res) => {
    // const productCount = await Product.countDocuments(count => count)
    const productCount = await Product.estimatedDocumentCount()
    // lay count dua tren dieu kien mac dinh ko co, k can co callback, Doc khuyen dung estimatedDocumentCount

    if (!productCount) return res.status(500).json({ success: false })
    res.send({ productCount })
})
// [GET] /products/get/featured
router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({ isFeatured: true }).limit(+count)

    if (!products) return res.status(500).json({ success: false })
    res.send(products)
})

module.exports = router
