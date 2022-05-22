const express = require('express')
const Book = require('../models/bookModel')
const bookController = require('../controllers/book.controller')
const retAuthorID = require('../middleware/retAuthorID')
const authAdmin = require('../middleware/authAdmin')
const paginatedResults = require('../middleware/paginatedResults')

const router = new express.Router()

router.delete('/book/:book', authAdmin, bookController.bookDelete)

router.post('/book/add', authAdmin, retAuthorID, bookController.bookAdd)

router.get('/books', paginatedResults(Book), async (req, res) => {
    res.send(res.paginatedResults)
})

router.get('/books/:book', bookController.bookGet)

module.exports = router