const express = require('express')
const Book = require('../models/bookModel')
const retAuthorID = require('../middleware/retAuthorID')

const router = new express.Router()

// add auth function for admin
router.post('/admin/add_book', retAuthorID, async (req, res) => {
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

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().populate('author')
        if (books.length > 0) {
            // for (let i = 0; i < books.length; i++) {
            //     await books[i].populate('author')
            // }
            res.status(200).send(books)
        }
    } catch (error) {
        res.status(403).send({
            status: 403,
            message: error.message
        })
    }

})

// router.get('/search_books', async (req, res) => {
//     try {
//         const searchString = req.query.searchString
//         const books = await Book.find().populate('author')

//         if (books.length > 0) {
//             return res.status(200).send(books)
//         }
//         return res.status(200).send('No books found.')
//     } catch (error) {
//         res.status(403).send({
//             status: 403,
//             message: error.message
//         })
//     }

// })

// router.get('/search_books', async (req, res) => {
//     try {
//         const searchString = req.query.searchString
//         const books = await Book.find({ $or: [{ "name": { "$regex": `${searchString}`, "$options": "i" } }, { 'author': '626e5973cd7b1e99e54497f7' }] }).populate('author')
//         if (books.length > 0) {
//             return res.status(200).send(books)
//         }
//         return res.status(200).send('No books found.')
//     } catch (error) {
//         res.status(403).send({
//             status: 403,
//             message: error.message
//         })
//     }

// })

// router.get('/search_books', async (req, res) => {
//     try {
//         const searchString = req.query.searchString
//         const books = await Book.find({ "name": { "$regex": `${searchString}`, "$options": "i" } }).populate('author')
//         if (books.length > 0) {
//             return res.status(200).send(books)
//         }
//         return res.status(200).send('No books found.')
//     } catch (error) {
//         res.status(403).send({
//             status: 403,
//             message: error.message
//         })
//     }

// })

// router.get('/search_books', async (req, res) => {
//     try {
//         const searchString = req.query.searchString

//     } catch (error) {
//         res.status(403).send({
//             status: 403,
//             message: error.message
//         })
//     }

// })


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

router.use((error, req, res, next) => {
    console.log("hello from error handler")
    res.status(error.status).send(
        {
            status: error.status,
            error: error.message
        }
    )
})

module.exports = router