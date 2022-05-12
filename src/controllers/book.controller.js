const Book = require('../models/bookModel')

const bookDelete = async (req, res, next) => {
    try {
        const bookName = req.body.name
        const book = await Book.findOne({ name: req.body.name })
        await Book.deleteOne(book)
        res.send(JSON.stringify(`deleted ${bookName}`))
    }
    catch (error) {
        return next(error);
    }
}

module.exports = {
    bookDelete
}