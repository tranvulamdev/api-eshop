const express = require('express')
const router = express.Router()
const { User } = require('../models/user')

router.get('/', (req, res) => {
    User.find({})
        .then(users => res.status(200).json(users))
        .catch(() => res.status(500).json({ success: false }))
})

router.post('/', (req, res) => {
    const user = new User({ ...req.body })
    user.save()
        .then(() => res.status(201).json(user))
        .catch(err => res.status(500).json({ error: err, success: false }))
})

module.exports = router
