const express = require('express')
const bookController = require('../controllers/book.controller')
// const retAuthorID = require('../middleware/retAuthorID')
const authAdmin = require('../middleware/authAdmin')
const paginatedResults = require('../middleware/paginatedResults')

const router = new express.Router()

router.delete('/books/:book', authAdmin, bookController.bookDelete)

router.patch('/books/:book', authAdmin, bookController.bookEdit)

// router.post('/books/add', authAdmin, retAuthorID, bookController.bookAdd)

router.post('/books/add', authAdmin, bookController.bookAdd)

router.get('/all-books', bookController.booksGet)

router.get('/books', paginatedResults, async (req, res) => {
    res.send(res.paginatedResults.results)
})

router.get('/books/:book', bookController.bookGet)

module.exports = router