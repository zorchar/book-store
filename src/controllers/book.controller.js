const Book = require('../models/bookModel')

const bookDelete = async (req, res, next) => {
    try {
        const bookName = req.params.book
        const book = await Book.findOne({ name: req.body.name })
        await Book.deleteOne(book)
        res.send(JSON.stringify(`deleted ${bookName}`))
    }
    catch (error) {
        return next(error);
    }
}

const bookAdd = async (req, res) => {
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
}

const bookGet = async (req, res, next) => {
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
}

module.exports = {
    bookDelete,
    bookAdd,
    bookGet
}