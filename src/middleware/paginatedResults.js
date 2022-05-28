const Book = require('../models/bookModel')

const paginatedResults = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 5
    const page = parseInt(req.query.page) || 1

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}
    if (endIndex < await Book.countDocuments())
        results.next =
        {
            page: page + 1,
            limit
        }

    if (startIndex > 0) {
        results.previous =
        {
            page: page - 1,
            limit
        }
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