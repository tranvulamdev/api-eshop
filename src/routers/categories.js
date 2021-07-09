const express = require('express')
const router = express.Router()
const { Category } = require('../models/category')

// [GET] /categories
router.get('/', async (req, res) => {
    const categoryList = await Category.find({})

    if (!categoryList) res.status(500).json({ success: false })
    res.status(200).send(categoryList)
})

// [GET] /categories/:id
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)

    if (!category)
        res.status(500).json({
            message: 'The category with the given ID was not found',
        })
    res.status(200).send(category)
})

// [POST] /categories
router.post('/', async (req, res) => {
    let category = new Category({ ...req.body })

    category = await category.save()

    if (!category)
        return res.status(500).send('the category cannot be created!')
    res.send(category)
})

// [PUT] /categories/:id
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color,
        },
        { new: true }
    )

    if (!category)
        return res.status(500).send('the category cannot be updated!')
    res.send(category)
})

// DELETE] /categories/:id
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            // slug id đúng format thì vào đây
            if (category)
                res.status(200).json({
                    success: true,
                    message: 'the category is deleted!',
                })
            else
                res.status(400).json({
                    success: false,
                    message: 'category not found!',
                })
        }) // slug id sai format (vd: ngắn hơn)
        .catch(err => res.status(500).json({ success: false, error: err }))
})

module.exports = router
