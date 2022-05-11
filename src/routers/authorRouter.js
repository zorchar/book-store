const express = require('express')
const Author = require('../models/authorModel')

const router = new express.Router()

router.post('/admin/add_author', async (req, res) => {
    const book = new Author(req.body)
    try {
        await book.save()
        res.send(book)
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
})

module.exports = router