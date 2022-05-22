const express = require('express')
const Book = require('../models/bookModel')
const retAuthorID = require('../middleware/retAuthorID')
const bookController = require('../controllers/book.controller')
const authAdmin = require('../middleware/authAdmin')
const paginatedResults = require('../middleware/paginatedResults')

const router = new express.Router()

router.delete('/book/delete', authAdmin, bookController.bookDelete)

router.post('/book/add', authAdmin, retAuthorID, async (req, res) => {
    try {
        let book = await Book.findOne({ name: req.body.name })
        if (book)
            throw new Error('Book already exists in database.')
        book = new Book(req.body)
        await book.save()
        await book.populate('author')
        res.status(201).send(book)
    } catch (error) {
        res.status(403).send({
            status: 403,
            message: error.message
        })
    }
})

router.get('/books', paginatedResults(Book), async (req, res) => {
    res.send(res.paginatedResults)
})

router.get('/books/:book', async (req, res, next) => {
    const bookName = req.params.book

    try {
        const book = await Book.findOne({ name: bookName }).populate('author')
        if (book !== null) {
            return res.status(200).send(book)
        }
        const err = new Error('No book found')
        err.status = 404
        next(err)
    } catch (error) {
        return next(error);
    }
})

module.exports = router