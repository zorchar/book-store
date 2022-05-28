const Book = require('../models/bookModel')

const paginatedResults = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 4
    const page = parseInt(req.query.page) || 1

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const documentCount = await Book.countDocuments()
    const pagesCount = Math.ceil(documentCount / limit)

    const pages = []
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i)
    }

    const results = {}
    results.pages = pages

    if (endIndex < documentCount) {
        results.next =
        {
            page: page + 1,
            limit
        }
        delete results.pages[page - 1]
    }
    if (startIndex > 0) {
        results.previous =
        {
            page: page - 1,
            limit
        }
        delete results.pages[page - 1]
    }

    try {
        results.results = await Book.find({
            $or: [
                { name: { "$regex": `${req.query.search || ""}`, "$options": "i" } },
                { author: { "$regex": `${req.query.search || ""}`, "$options": "i" } }
            ]
        }).limit(limit).skip(startIndex)
        res.paginatedResults = results
        next()
    } catch (error) {
        res.status(500).send(
            {
                message: error.message
            }
        )
    }
}

module.exports = paginatedResults