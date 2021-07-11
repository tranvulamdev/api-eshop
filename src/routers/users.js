const express = require('express')
const router = express.Router()
const { User } = require('../models/user')

// ma hoa bao mat password
const bcrypt = require('bcryptjs')

// jwt
const jwt = require('jsonwebtoken')

// [GET] /users
router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash')

    if (!userList) return res.status(500).json({ success: false })
    res.send(userList)
})

// [GET] /users/:id
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash')

    if (!user)
        res.status(500).json({
            message: 'The user with the given ID was not found',
        })
    res.status(200).send(user)
})

// [PUT] /:id
router.put('/:id', async (req, res) => {
    const userExist = await User.findById(req.params.id)

    let newPassword
    if (req.body.password) newPassword = bcrypt.hashSync(req.body.password, 10)
    else newPassword = userExist.passwordHash

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true }
    )

    if (!user) return res.status(400).send('the user cannot updated')
    res.send(user)
})

// [POST] /  for admin
router.post('/', async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email })
    if (userExist) return res.status(500).send('user email already exists')

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    user = await user.save()

    if (!user) return res.status(500).send('the user cannot be created!')
    res.send(user)
})

// [POST] /users/login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.SECRET_KEY

    if (!user) return res.status(400).send('user not found')

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            secret,
            { expiresIn: '1d' }
        )

        res.status(200).send({ user: user.email, token: token })
    } else res.status(400).send('the password is incorrect')
})

// [POST] /users/register
router.post('/register', async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email })
    if (userExist) return res.status(500).send('user email already exists')

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    user = await user.save()

    if (!user) return res.status(500).send('the user cannot be created!')
    res.send(user)
})

// [GET] /users/get/count
router.get('/get/count', async (req, res) => {
    const userCount = await User.estimatedDocumentCount()

    if (!userCount) return res.status(500).json({ success: false })
    res.send({ userCount })
})

// [DELETE] /users/:id
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then(user => {
            if (user)
                res.status(200).json({
                    success: true,
                    message: 'the user is deleted!',
                })
            else
                res.status(404).json({
                    success: false,
                    message: 'user not found!',
                })
        })
        .catch(err => res.status(500).json({ success: false, error: err }))
})

module.exports = router
